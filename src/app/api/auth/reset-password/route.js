import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

function isStrongPassword(password) {
  const minLength = 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  return password.length >= minLength && hasLetter && hasNumber;
}

export async function POST(req) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
  }

  if (!isStrongPassword(password)) {
    return NextResponse.json({
      error: 'Password must be at least 8 characters long and include both letters and numbers.',
    }, { status: 400 });
  }

  const reset = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!reset || reset.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Token is invalid or expired' }, { status: 400 });
  }

  const hashed = await hash(password, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: reset.userId },
      data: { password: hashed },
    }),
    prisma.passwordResetToken.delete({
      where: { token },
    }),
  ]);

  return NextResponse.json({ message: 'Password reset successful' });
}
