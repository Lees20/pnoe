import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs'; // For hashing password if needed

export async function POST(req) {
  const session = await getServerSession({ req, ...authOptions });

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { name, email, phone, password, dateOfBirth } = await req.json();

  try {
    const updates = {
      name,
      email,
      phone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updates,
    });

    return NextResponse.json({ message: 'Account updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ message: 'Failed to update account' }, { status: 500 });
  }
}
