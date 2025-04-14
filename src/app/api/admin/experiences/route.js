import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'; // Adjust the path if necessary

// Utility function to handle errors and responses
const handleResponse = (data, status = 200) => {
  return NextResponse.json(data, { status });
};

// GET /api/admin/experiences - Fetch all experiences
export async function GET() {
  try {
    const experiences = await prisma.experience.findMany();
    return handleResponse(experiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return handleResponse({ error: 'Failed to fetch experiences' }, 500);
  }
}

// POST /api/admin/experiences - Create a new experience
export async function POST(req) {
  const { name, description, price, location, duration, whatsIncluded, whatToBring, whyYoullLove, images, mapPin, guestReviews } = await req.json();

  // Simple validation for required fields
  if (!name || !description || !price || !location || !duration) {
    return handleResponse({ error: 'Missing required fields' }, 400);
  }

  try {
    const newExperience = await prisma.experience.create({
      data: {
        name,
        description,
        price,
        location,
        duration,
        whatsIncluded,
        whatToBring,
        whyYoullLove,
        images,
        mapPin,
        guestReviews,
      },
    });
    return handleResponse(newExperience);
  } catch (error) {
    console.error("Error creating experience:", error);
    return handleResponse({ error: 'Failed to add experience' }, 500);
  }
}

// PUT /api/admin/experiences - Update an existing experience
export async function PUT(req) {
  const { id, name, description, price, location, duration, whatsIncluded, whatToBring, whyYoullLove, images, mapPin, guestReviews } = await req.json();

  // Validate ID and required fields
  if (!id || !name || !description || !price || !location || !duration) {
    return handleResponse({ error: 'Missing required fields' }, 400);
  }

  try {
    const updatedExperience = await prisma.experience.update({
      where: { id },
      data: {
        name,
        description,
        price,
        location,
        duration,
        whatsIncluded,
        whatToBring,
        whyYoullLove,
        images,
        mapPin,
        guestReviews,
      },
    });
    return handleResponse(updatedExperience);
  } catch (error) {
    if (error.code === 'P2025') { // Prisma error for record not found
      return handleResponse({ error: 'Experience not found' }, 404);
    }
    console.error("Error updating experience:", error);
    return handleResponse({ error: 'Failed to update experience' }, 500);
  }
}

// DELETE /api/admin/experiences - Delete an experience
export async function DELETE(req) {
  const { id } = await req.json();

  // Validate ID
  if (!id) {
    return handleResponse({ error: 'Experience ID is required' }, 400);
  }

  try {
    const deletedExperience = await prisma.experience.delete({
      where: { id },
    });
    return handleResponse(deletedExperience);
  } catch (error) {
    if (error.code === 'P2025') { // Prisma error for record not found
      return handleResponse({ error: 'Experience not found' }, 404);
    }
    if (error.code === 'P2003') {
      return NextResponse.json(
        {
          error: 'The experience cannot be deleted because it is related to other records (e.g., bookings). Please delete the related records first and try again.',
        },
        { status: 400 }
      );
    }
    console.error("Error deleting experience:", error);
    return handleResponse({ error: 'Failed to delete experience' }, 500);
  }
}
