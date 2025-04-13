import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'; // Adjust the path if necessary

// GET /api/admin/experiences
export async function GET() {
  try {
    // Fetch experiences from the database
    const experiences = await prisma.experience.findMany();
    return NextResponse.json(experiences); // Return JSON response with 200 status by default
  } catch (error) {
    console.error("Error fetching experiences:", error); // Log error details for debugging
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
  }
}

// POST /api/admin/experiences
export async function POST(req) {
  const { name, description } = await req.json(); // Read the request body

  try {
    const newExperience = await prisma.experience.create({
      data: { name, description },
    });
    return NextResponse.json(newExperience, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add experience' }, { status: 500 });
  }
}

// PUT /api/admin/experiences
export async function PUT(req) {
  const { id, name, description } = await req.json(); // Read the request body

  try {
    const updatedExperience = await prisma.experience.update({
      where: { id },
      data: { name, description },
    });
    return NextResponse.json(updatedExperience, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
  }
}

// DELETE /api/admin/experiences
export async function DELETE(req) {
  const { id } = await req.json(); // Read the request body

  try {
    const deletedExperience = await prisma.experience.delete({
      where: { id },
    });
    return NextResponse.json(deletedExperience, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
