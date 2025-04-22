import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { transporter } from '@/lib/email/nodemailer';
import { generateBookingConfirmationEmail } from '@/lib/email/bookingConfirmationEmail';
import { generateCancellationEmail } from '@/lib/email/cancellationEmail';

// === Utilities ===
const handleResponse = (data, status = 200) => {
  return NextResponse.json(data, { status });
};

const requireAdmin = async (req) => {
  const session = await getServerSession({ req, ...authOptions });
  if (!session || session.user.role !== 'admin') {
    return { error: true, response: handleResponse({ error: 'Unauthorized' }, 401) };
  }
  return { error: false };
};

const requireUser = async (req) => {
  const session = await getServerSession({ req, ...authOptions });
  if (!session || !session.user) {
    return { error: true, response: handleResponse({ error: 'Unauthorized' }, 401) };
  }
  return { error: false, user: session.user };
};

// === GET: Fetch all reservations (Admin only) ===
export async function GET(req) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.response;

  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            surname: true,
            phone: true,
          },
        },
        scheduleSlot: {
          select: {
            id: true,
            date: true,
            experience: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        scheduleSlot: {
          date: 'desc',
        },
      },
    });

    return handleResponse(bookings);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return handleResponse({ error: 'Failed to fetch reservations' }, 500);
  }
}

// === POST: Create reservation (User) ===
export async function POST(req) {
  const auth = await requireUser(req);
  if (auth.error) return auth.response;

  const { user } = auth;
  const { scheduleSlotId, numberOfPeople = 1, notes = '' } = await req.json();

  try {
    const slot = await prisma.scheduleSlot.findUnique({
      where: { id: Number(scheduleSlotId) },
    });

    if (!slot) {
      return handleResponse({ error: 'Schedule slot not found' }, 404);
    }

    if (slot.bookedSlots + numberOfPeople > slot.totalSlots) {
      return handleResponse({ error: 'Not enough available slots for this date' }, 400);
    }

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        scheduleSlotId: Number(scheduleSlotId),
        numberOfPeople: Number(numberOfPeople),
        notes,
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
        scheduleSlot: {
          include: {
            experience: {
              select: { name: true, location: true },
            },
          },
        },
      },
    });

    await prisma.scheduleSlot.update({
      where: { id: Number(scheduleSlotId) },
      data: {
        bookedSlots: {
          increment: Number(numberOfPeople),
        },
      },
    });

    // Send confirmation email
    const { subject, html } = generateBookingConfirmationEmail(booking);
    await transporter.sendMail({
      from: `"Oasis" <${process.env.EMAIL_USER}>`,
      to: booking.user.email,
      subject,
      html,
    });
    

    return handleResponse({ id: booking.id });

  } catch (error) {
    console.error('Error creating reservation:', error);
    return handleResponse({ error: 'Failed to create reservation' }, 500);
  }
}


// === PATCH: Update reservation (Admin only) ===
export async function PATCH(req) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.response;

  const {
    id,
    userId,
    scheduleSlotId,
    numberOfPeople = 1,
    notes = '',
  } = await req.json();

  try {
    const oldBooking = await prisma.booking.findUnique({
      where: { id: Number(id) },
    });

    if (!oldBooking) {
      return handleResponse({ error: 'Booking not found' }, 404);
    }

    const isSlotChanged = oldBooking.scheduleSlotId !== Number(scheduleSlotId);
    const isPeopleChanged = oldBooking.numberOfPeople !== Number(numberOfPeople);

    if (isSlotChanged || isPeopleChanged) {
      // Restore old
      await prisma.scheduleSlot.update({
        where: { id: oldBooking.scheduleSlotId },
        data: { bookedSlots: { decrement: oldBooking.numberOfPeople } },
      });

      const newSlot = await prisma.scheduleSlot.findUnique({
        where: { id: Number(scheduleSlotId) },
      });

      if (!newSlot) {
        return handleResponse({ error: 'Schedule slot not found' }, 404);
      }

      if (newSlot.bookedSlots + numberOfPeople > newSlot.totalSlots) {
        return handleResponse({ error: 'Not enough availability on new slot' }, 400);
      }

      await prisma.scheduleSlot.update({
        where: { id: Number(scheduleSlotId) },
        data: { bookedSlots: { increment: Number(numberOfPeople) } },
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: Number(id) },
      data: {
        userId: Number(userId),
        scheduleSlotId: Number(scheduleSlotId),
        numberOfPeople: Number(numberOfPeople),
        notes,
      },
    });

    return handleResponse(updatedBooking);
  } catch (error) {
    console.error('Error updating reservation:', error);
    return handleResponse({ error: 'Failed to update reservation' }, 500);
  }
}

// === DELETE: Delete reservation (Admin only) ===
export async function DELETE(req) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.response;

  const { id } = await req.json();

  try {
    // Get full booking details before deletion
    const bookingDetails = await prisma.booking.findUnique({
      where: { id: Number(id) },
      include: {
        user: true,
        scheduleSlot: {
          include: {
            experience: true,
          },
        },
      },
    });

    if (!bookingDetails) {
      return handleResponse({ error: 'Booking not found' }, 404);
    }

    // Delete the booking
    await prisma.booking.delete({
      where: { id: Number(id) },
    });

    // Decrease the booked slots count
    await prisma.scheduleSlot.update({
      where: { id: bookingDetails.scheduleSlotId },
      data: {
        bookedSlots: {
          decrement: bookingDetails.numberOfPeople,
        },
      },
    });

    // Send cancellation email
    const emailContent = generateCancellationEmail(bookingDetails);
    await transporter.sendMail({
      to: bookingDetails.user.email,
      from: `"Oasis" <${process.env.EMAIL_USER}>`,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    return handleResponse({ success: true });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    return handleResponse({ error: 'Failed to delete reservation' }, 500);
  }
}