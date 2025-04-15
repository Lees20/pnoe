import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

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

// GET: Fetch all users
export async function GET(req) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.response;

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        phone: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return handleResponse(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return handleResponse({ error: 'Failed to fetch users' }, 500);
  }
}

// POST: Create new user
export async function POST(req) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.response;

  const { email, password, name, surname, phone, role } = await req.json();

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        password, // In production: hash before saving
        name,
        surname,
        phone,
        role,
      },
    });
    return handleResponse(newUser);
  } catch (error) {
    console.error('Failed to create user:', error);
    return handleResponse({ error: 'Failed to create user' }, 500);
  }
}

// PUT: Update user
export async function PUT(req) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.response;

  const { id, email, name, surname, phone, role } = await req.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { email, name, surname, phone, role },
    });
    return handleResponse(updatedUser);
  } catch (error) {
    console.error('Failed to update user:', error);
    return handleResponse({ error: 'Failed to update user' }, 500);
  }
}

// DELETE: Delete user
export async function DELETE(req) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.response;

  const { id } = await req.json();

  try {
    const deletedUser = await prisma.user.delete({
      where: { id: Number(id) },
    });
    return handleResponse(deletedUser);
  } catch (error) {
    console.error('Error deleting user:', error);

    if (error.code === 'P2003') {
      return handleResponse({
        error: 'Cannot delete user. User has bookings or favourites. Please delete them first.',
      }, 400);
    }

    return handleResponse({ error: 'Failed to delete user.' }, 500);
  }
}
