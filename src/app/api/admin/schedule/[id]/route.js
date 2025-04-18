import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// PUT: Update totalSlots and bookedSlots only
export async function PUT(req, context) {
  const { id } = context.params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: 'Missing or invalid ID' }, { status: 400 });
  }

  const { totalSlots, bookedSlots } = await req.json();

  if (typeof totalSlots !== 'number' || totalSlots < 0) {
    return NextResponse.json({ error: 'Invalid totalSlots' }, { status: 400 });
  }

  if (typeof bookedSlots !== 'number' || bookedSlots < 0) {
    return NextResponse.json({ error: 'Invalid bookedSlots' }, { status: 400 });
  }

  if (bookedSlots > totalSlots) {
    return NextResponse.json({ error: 'Booked slots cannot exceed total slots' }, { status: 400 });
  }

  try {
    const updated = await prisma.scheduleSlot.update({
      where: { id: Number(id) },
      data: {
        totalSlots,
        bookedSlots,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT slot error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
