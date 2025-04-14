import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Fetch all users
export async function GET() {
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
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST: Create new user
export async function POST(req) {
  const body = await req.json();
  const { email, password, name, surname, phone, role } = body;

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        password, // Hash in real case
        name,
        surname,
        phone,
        role,
      },
    });
    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

// PUT: Update user
export async function PUT(req) {
  const body = await req.json();
  const { id, email, name, surname, phone, role } = body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { email, name, surname, phone, role },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE: Delete user
export async function DELETE(req) {
  const body = await req.json();
  const { id } = body;

  try {
    const deletedUser = await prisma.user.delete({
      where: { id },
    });
    return NextResponse.json(deletedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
