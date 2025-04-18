import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET slots for an experience
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const experienceId = parseInt(searchParams.get('experienceId'), 10);

  if (!experienceId) {
    return NextResponse.json({ error: "Experience ID required" }, { status: 400 });
  }

  const slots = await prisma.scheduleSlot.findMany({
    where: { experienceId },
    orderBy: { date: 'asc' },
  });

  return NextResponse.json(slots);
}

// POST create a new slot
export async function POST(req) {
  const { experienceId, date, totalSlots } = await req.json();

  const newSlot = await prisma.scheduleSlot.create({
    data: {
      experienceId: parseInt(experienceId, 10),
      date: new Date(date),
      totalSlots,
    },
  });

  return NextResponse.json(newSlot, { status: 201 });
}

// PUT update an existing slot
export async function PUT(req) {
  const { id, date, totalSlots } = await req.json();

  const updatedSlot = await prisma.scheduleSlot.update({
    where: { id: parseInt(id, 10) },
    data: {
      date: new Date(date),
      totalSlots,
    },
  });

  return NextResponse.json(updatedSlot);
}

// DELETE remove a slot
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get('id'), 10);

  await prisma.scheduleSlot.delete({ where: { id } });

  return NextResponse.json({ message: "Deleted slot successfully" });
}
