import { getSession } from "next-auth/react";
import prisma from "../../../../../lib/prisma"; // Ensure correct import

export async function DELETE(req) {
  try {
    const session = await getSession({ req });
    if (!session || !session.user) {
      return new Response(
        JSON.stringify({ message: "You must be logged in to delete your account." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Perform user deletion logic
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    await prisma.user.delete({
      where: { email: user.email },
    });

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
