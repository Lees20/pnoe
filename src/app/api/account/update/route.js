import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const session = await getServerSession({ req, ...authOptions });

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { name, email, phone, password, dateOfBirth } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const updates = {
      name,
      email,
      phone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
    };

    if (password) {
      // Validate strength
      const isStrongPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!isStrongPassword.test(password)) {
        return NextResponse.json(
          { message: 'Password must be at least 8 characters and include letters and numbers.' },
          { status: 400 }
        );
      }

      // Limit to 2 changes per 30 days
      const now = new Date();
      const history = user.passwordChangeHistory || [];
      const recentChanges = history.filter(
        (timestamp) => new Date(timestamp) > new Date(now.setDate(now.getDate() - 30))
      );

      if (recentChanges.length >= 2) {
        return NextResponse.json(
          { message: 'You can only update your settings up to 2 times per month.' },
          { status: 403 }
        );
      }

      //  Update password and history
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
      updates.passwordChangeHistory = [...recentChanges, new Date().toISOString()];
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
