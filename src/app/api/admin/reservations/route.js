import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Utility function to handle API responses
const handleResponse = (data, status = 200) => {
  return NextResponse.json(data, { status });
};

// Utility function to protect routes
const requireAdmin = async (req) => {
  const session = await getServerSession({ req, ...authOptions });
  if (!session || session.user.role !== 'admin') {
    return { error: true, response: handleResponse({ error: 'Unauthorized' }, 401) };
  }
  return { error: false };
};

// GET: Fetch all reservations
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

// POST: Create reservation
export async function POST(req) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.response;

  const { userId, scheduleSlotId, numberOfPeople = 1, notes = '' } = await req.json();

  try {
    const slot = await prisma.scheduleSlot.findUnique({
      where: { id: Number(scheduleSlotId) },
    });

    if (!slot) {
      return handleResponse({ error: 'Schedule slot not found' }, 404);
    }

    // Check if enough availability exists
    if (slot.bookedSlots + numberOfPeople > slot.totalSlots) {
      return handleResponse({ error: 'Not enough available slots for this date' }, 400);
    }

    const booking = await prisma.booking.create({
      data: {
        userId: Number(userId),
        scheduleSlotId: Number(scheduleSlotId),
        numberOfPeople: Number(numberOfPeople),
        notes,
      },
      include: {
        user: { select: { id: true, email: true, name: true, surname: true, phone: true } },
        scheduleSlot: {
          select: {
            id: true,
            date: true,
            experience: { select: { id: true, name: true } },
          },
        },
      },
    });

    await prisma.scheduleSlot.update({
      where: { id: Number(scheduleSlotId) },
      data: { bookedSlots: { increment: numberOfPeople } },
    });

    return handleResponse(booking);
  } catch (error) {
    console.error('Error creating reservation:', error);
    return handleResponse({ error: 'Failed to create reservation' }, 500);
  }
}

// PATCH: Update reservation
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
      // Restore slots from old booking
      await prisma.scheduleSlot.update({
        where: { id: oldBooking.scheduleSlotId },
        data: { bookedSlots: { decrement: oldBooking.numberOfPeople } },
      });

      // Check availability on new slot
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
        data: { bookedSlots: { increment: numberOfPeople } },
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
      include: {
        user: { select: { id: true, email: true, name: true, surname: true, phone: true } },
        scheduleSlot: {
          select: {
            id: true,
            date: true,
            experience: { select: { id: true, name: true } },
          },
        },
      },
    });

    return handleResponse(updatedBooking);
  } catch (error) {
    console.error('Error updating reservation:', error);
    return handleResponse({ error: 'Failed to update reservation' }, 500);
  }
}

// DELETE: Delete reservation
export async function DELETE(req) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.response;

  const { id } = await req.json();

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
      select: { scheduleSlotId: true, numberOfPeople: true },
    });

    if (!booking) {
      return handleResponse({ error: 'Booking not found' }, 404);
    }

    await prisma.booking.delete({
      where: { id: Number(id) },
    });

    await prisma.scheduleSlot.update({
      where: { id: booking.scheduleSlotId },
      data: {
        bookedSlots: { decrement: booking.numberOfPeople },
      },
    });

    return handleResponse({ success: true });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    return handleResponse({ error: 'Failed to delete reservation' }, 500);
  }
}

