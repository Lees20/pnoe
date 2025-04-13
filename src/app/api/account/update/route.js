import { hash } from "bcryptjs";
import { getSession } from "next-auth/react"; // If using session-based auth
import prisma from '../../../../../lib/prisma';  // Correct import path for the singleton Prisma Client

export async function POST(request) {
  try {
    // Get the current session (if using NextAuth.js for session management)
    const session = await getSession({ req: request });

    if (!session) {
      return new Response(
        JSON.stringify({ message: "You must be logged in to update your account." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    // Find user by session email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // If email is provided and it's different from the current one, update it
    if (email && email !== user.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email },
      });

      if (emailTaken) {
        return new Response(
          JSON.stringify({ message: "Email is already taken." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      await prisma.user.update({
        where: { email: user.email },
        data: { email },
      });
    }

    // If password is provided, hash and update it
    if (password) {
      const hashedPassword = await hash(password, 10);

      await prisma.user.update({
        where: { email: user.email },
        data: { password: hashedPassword },
      });
    }

    return new Response(
      JSON.stringify({ message: "Account updated successfully!" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating account:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
