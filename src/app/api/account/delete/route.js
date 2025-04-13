import { getSession } from "next-auth/react"; // If using session-based auth
import prisma from "../../../../../lib/prisma"; // Ensure correct import path

export async function DELETE(req) {
  try {
    // Get the current session
    const session = await getSession({ req });

    if (!session || !session.user) {
      return new Response(
        JSON.stringify({ message: "You must be logged in to delete your account." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find the user in the database using email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Delete the user from the database
    await prisma.user.delete({
      where: { email: user.email },
    });

    // Send a success response
    return new Response(
      JSON.stringify({ message: "Account deleted successfully." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error deleting account:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
