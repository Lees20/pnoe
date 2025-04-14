import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Fetch all reservations
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { id: true, email: true, name: true, surname: true } },
        experience: { select: { id: true, name: true } },
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
  }
}
// POST: Create new reservation
export async function POST(req) {
    const body = await req.json();
    const { userId, experienceId, date } = body;
  
    try {
      const booking = await prisma.booking.create({
        data: {
          userId: Number(userId),
          experienceId: Number(experienceId),
          date: new Date(date),
        },
        include: { //  Include για να επιστραφούν τα πλήρη δεδομένα
          user: { select: { id: true, email: true, name: true, surname: true } },
          experience: { select: { id: true, name: true } },
        },
      });
  
      return NextResponse.json(booking);
    } catch (error) {
      console.error('Error creating reservation:', error);
      return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
    }
  }
  

export async function PATCH(req) {
    const body = await req.json();
    const { id, userId, experienceId, date } = body;
  
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
  
      return NextResponse.json(updatedBooking);
    } catch (error) {
      console.error('Error updating reservation:', error);
      return NextResponse.json({ error: 'Failed to update reservation' }, { status: 500 });
    }
  }
  

// DELETE: Delete reservation
export async function DELETE(req) {
  const body = await req.json();
  const { id } = body;

  try {
    const deletedBooking = await prisma.booking.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedBooking);
  } catch (error) {
    console.error('Error deleting reservation:', error);
    return NextResponse.json({ error: 'Failed to delete reservation' }, { status: 500 });
  }
}
