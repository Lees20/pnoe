import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Get all slots for a given experience
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const experienceId = parseInt(searchParams.get('experienceId'), 10);

  if (!experienceId) {
    return NextResponse.json({ error: "Experience ID required" }, { status: 400 });
  }

  try {
    const slots = await prisma.scheduleSlot.findMany({
      where: { experienceId },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(slots);
  } catch (error) {
    console.error("GET /schedule error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST: Create a new schedule slot
export async function POST(req) {
  const { experienceId, date, totalSlots } = await req.json();

  if (!experienceId || !date || totalSlots == null) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const newSlot = await prisma.scheduleSlot.create({
      data: {
        experienceId: parseInt(experienceId, 10),
        date: new Date(date),
        totalSlots: Number(totalSlots),
        bookedSlots: 0, // ensure consistency
      },
    });

    return NextResponse.json(newSlot, { status: 201 });
  } catch (error) {
    console.error("POST /schedule error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT: Only allow updating totalSlots (bookedSlots via reservations only)
export async function PUT(req) {
  try {
    const { id, totalSlots } = await req.json();

    if (!id || totalSlots == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (typeof totalSlots !== 'number' || totalSlots < 0) {
      return NextResponse.json({ error: "Invalid totalSlots" }, { status: 400 });
    }

    const existing = await prisma.scheduleSlot.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    if (existing.bookedSlots > totalSlots) {
      return NextResponse.json({
        error: `Cannot set total slots below currently booked (${existing.bookedSlots}).`,
      }, { status: 400 });
    }

    const updatedSlot = await prisma.scheduleSlot.update({
      where: { id },
      data: { totalSlots },
    });

    return NextResponse.json(updatedSlot);
  } catch (error) {
    console.error("PUT /schedule error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE: Remove a slot
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get('id'), 10);

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    await prisma.scheduleSlot.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted slot successfully" });
  } catch (error) {
    console.error("DELETE /schedule error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
