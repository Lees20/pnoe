// src/app/api/account/update/route.js

import { getSession } from 'next-auth/react';  // Use NextAuth to get the current session
import prisma from '../../../../lib/prisma';  // Assuming Prisma client is set up

export async function POST(req) {
  const session = await getSession({ req });  // Get session info (user)

  if (!session) {
    return new Response(
      JSON.stringify({ message: 'You must be signed in to update your account.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { name, email, phone, password } = await req.json();  // Parse incoming request body

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ message: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || user.name,
        email: email || user.email,
        phone: phone || user.phone,
        password: password || user.password, // Ensure password is hashed if updating
      },
    });

    return new Response(
      JSON.stringify({ message: 'Account updated successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'An error occurred while updating your information.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
