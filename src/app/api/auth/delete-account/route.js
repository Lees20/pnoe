import { getServerSession } from 'next-auth';
import prisma  from '@/lib/prisma'; // Import your Prisma client correctly
import { NextResponse } from 'next/server';
import { authOptions } from '../[...nextauth]/route'; // Make sure you're using the right NextAuth.js options

export async function DELETE(req) {
  // Get session for the request
  const session = await getServerSession(authOptions); // Get session from NextAuth.js

  if (!session) {
    // If no session found, return 401 Unauthorized
    return new NextResponse(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }

  // Parse userId from the request body
  const { userId } = await req.json();

  // Log userId and session.user.id to ensure they match
  console.log('Session User ID:', session.user.id);
  console.log('Received userId:', userId);

  // Check if the user is deleting their own account
  if (session.user.id !== userId) {
    return new NextResponse(
      JSON.stringify({ error: "You cannot delete another user's account" }),
      { status: 403 }
    );
  }

  try {
    // Ensure that userId exists in the database before deleting
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      console.log('User not found with ID:', userId);
      return new NextResponse(
        JSON.stringify({ error: 'User not found' }),
        { status: 404 }
      );
    }

    // Proceed with account deletion from the database
    await prisma.user.delete({
      where: { id: userId },
    });

    return new NextResponse(JSON.stringify({ message: 'Account deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting account:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to delete account. If you have active Bookings, please contact support.' }), { status: 500 });
  }
}
