
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const session = await getServerSession({ req, ...authOptions });

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: {
      scheduleSlot: {
        include: {
          experience: true,
        },
      },
    },
    orderBy: {
      scheduleSlot: {
        date: 'desc',
      },
    },
  });

  return NextResponse.json(bookings);
}
