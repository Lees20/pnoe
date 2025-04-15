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
        user: { select: { id: true, email: true, name: true, surname: true, phone: true } },
        experience: { select: { id: true, name: true } },
      },
      orderBy: { date: 'desc' },
    });

    return handleResponse(bookings);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return handleResponse({ error: 'Failed to fetch reservations' }, 500);
  }
}

// POST: Create new reservation
export async function POST(req) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.response;

  const { userId, experienceId, date } = await req.json();

  try {
    const booking = await prisma.booking.create({
      data: {
        userId: Number(userId),
        experienceId: Number(experienceId),
        date: new Date(date),
      },
      include: {
        user: { select: { id: true, email: true, name: true, surname: true } },
        experience: { select: { id: true, name: true } },
      },
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

  const { id, userId, experienceId, date } = await req.json();

  try {
    const updatedBooking = await prisma.booking.update({
      where: { id: Number(id) },
      data: {
        userId: Number(userId),
        experienceId: Number(experienceId),
        date: new Date(date),
      },
      include: {
        user: { select: { id: true, email: true, name: true, surname: true } },
        experience: { select: { id: true, name: true } },
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
    const deletedBooking = await prisma.booking.delete({
      where: { id: Number(id) },
    });

    return handleResponse(deletedBooking);
  } catch (error) {
    console.error('Error deleting reservation:', error);
    return handleResponse({ error: 'Failed to delete reservation' }, 500);
  }
}
