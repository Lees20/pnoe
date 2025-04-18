import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: slots for an experience
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

// POST: create a new slot
export async function POST(req) {
  const { experienceId, date, totalSlots } = await req.json();

  if (!experienceId || !date || !totalSlots) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const newSlot = await prisma.scheduleSlot.create({
      data: {
        experienceId: parseInt(experienceId, 10),
        date: new Date(date),
        totalSlots,
      },
    });

    return NextResponse.json(newSlot, { status: 201 });
  } catch (error) {
    console.error("POST /schedule error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT: block direct update here to avoid modifying date by mistake
export async function PUT() {
  return NextResponse.json(
    { error: "Use /api/admin/schedule/[id] for updates" },
    { status: 405 }
  );
}

// DELETE: remove a slot (optional)
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
