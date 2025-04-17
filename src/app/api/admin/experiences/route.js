import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import slugify from 'slugify'; // Import the slugify utility

// Utility function to handle responses
const handleResponse = (data, status = 200) => {
  return NextResponse.json(data, { status });
};

// Utility to require admin session
const requireAdmin = async (req) => {
  const session = await getServerSession({ req, ...authOptions });
  if (!session || session.user.role !== 'admin') {
    return { error: true, response: handleResponse({ error: 'Unauthorized' }, 401) };
  }
  return { error: false, session };
};

// GET /api/admin/experiences
export async function GET(req) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.response;

  try {
    const experiences = await prisma.experience.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        location: true,
        duration: true,
        whatsIncluded: true,
        whatToBring: true,
        whyYoullLove: true,
        images: true,
        mapPin: true,
        guestReviews: true,
        frequency: true,  // Include frequency field
        visibility: true, // Include visibility field
        createdAt: true,
        updatedAt: true,
      }
    });
    return handleResponse(experiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return handleResponse({ error: 'Failed to fetch experiences' }, 500);
  }
}

// POST /api/admin/experiences
export async function POST(req) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.response;

  const {
    name, description, price, location, duration,
    whatsIncluded, whatToBring, whyYoullLove,
    images, mapPin, guestReviews, frequency, visibility
  } = await req.json();

  if (!name || !description || !price || !location || !duration) {
    return handleResponse({ error: 'Missing required fields' }, 400);
  }

  // Generate slug from the name
  const slug = slugify(name, { lower: true, strict: true });

  try {
    const newExperience = await prisma.experience.create({
      data: {
        name,
        slug,  // Add the slug here
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
        frequency,  // Add frequency array
        visibility,  // Add visibility toggle
      },
    });
    return handleResponse(newExperience);
  } catch (error) {
    console.error("Error creating experience:", error);
    return handleResponse({ error: 'Failed to add experience' }, 500);
  }
}

// PUT /api/admin/experiences
export async function PUT(req) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.response;

  const {
    id, name, description, price, location, duration,
    whatsIncluded, whatToBring, whyYoullLove,
    images, mapPin, guestReviews, frequency, visibility
  } = await req.json();

  if (!id || !name || !description || !price || !location || !duration) {
    return handleResponse({ error: 'Missing required fields' }, 400);
  }

  // Generate slug from the name, only if name is changed
  const slug = slugify(name, { lower: true, strict: true });

  try {
    const updatedExperience = await prisma.experience.update({
      where: { id },
      data: {
        name,
        slug,  // Update the slug here
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
        frequency,  // Update frequency array
        visibility,  // Update visibility toggle
      },
    });
    return handleResponse(updatedExperience);
  } catch (error) {
    if (error.code === 'P2025') {
      return handleResponse({ error: 'Experience not found' }, 404);
    }
    console.error("Error updating experience:", error);
    return handleResponse({ error: 'Failed to update experience' }, 500);
  }
}

// DELETE /api/admin/experiences
export async function DELETE(req) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.response;

  const { id } = await req.json();

  if (!id) {
    return handleResponse({ error: 'Experience ID is required' }, 400);
  }

  try {
    const deletedExperience = await prisma.experience.delete({ where: { id } });
    return handleResponse(deletedExperience);
  } catch (error) {
    if (error.code === 'P2025') {
      return handleResponse({ error: 'Experience not found' }, 404);
    }
    if (error.code === 'P2003') {
      return handleResponse({
        error: 'The experience is related to other records (e.g., bookings). Please delete them first.'
      }, 400);
    }
    console.error("Error deleting experience:", error);
    return handleResponse({ error: 'Failed to delete experience' }, 500);
  }
}
