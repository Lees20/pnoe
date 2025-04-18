// src/app/api/admin/schedule/[id]/route.js
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Fetch single schedule slot by ID
export async function GET(_, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  try {
    const slot = await prisma.scheduleSlot.findUnique({
      where: { id: Number(id) },
    });

    if (!slot) {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
    }

    return NextResponse.json(slot);
  } catch (error) {
    console.error('GET slot error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update slot (totalSlots or bookedSlots)
export async function PUT(req, { params }) {
  const { id } = params;
  const { totalSlots, bookedSlots } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  try {
    const updated = await prisma.scheduleSlot.update({
      where: { id: Number(id) },
      data: {
        ...(totalSlots !== undefined && { totalSlots }),
        ...(bookedSlots !== undefined && { bookedSlots }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT slot error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete a slot
export async function DELETE(_, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  try {
    await prisma.scheduleSlot.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE slot error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
