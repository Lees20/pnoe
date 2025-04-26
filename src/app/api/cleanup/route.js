// src/app/api/cleanup/route.js
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const authHeader = req.headers.get('Authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const deletedReservations = await prisma.booking.deleteMany({
      where: {
        scheduleSlot: {
          date: {
            lt: oneMonthAgo,
          },
        },
      },
    });

    const deletedSlots = await prisma.scheduleSlot.deleteMany({
      where: {
        date: {
          lt: oneMonthAgo,
        },
      },
    });

    console.log(`Cleanup complete: ${deletedReservations.count} reservations, ${deletedSlots.count} slots deleted.`);
    return NextResponse.json({ message: 'Cleanup complete' }, { status: 200 });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
  }
}
