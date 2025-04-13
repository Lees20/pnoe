import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: 'Missing email or password' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ message: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Compare entered password with hashed password in the database
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ message: 'Invalid password' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If login is successful, you can create a session or JWT (this depends on your auth flow)
    return new Response(
      JSON.stringify({ message: 'Login successful' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
