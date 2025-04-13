import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

// Use the Prisma singleton pattern
let prisma;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // In development mode, Prisma client can be reused to prevent creating a new connection on each request.
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null; // Return null if credentials are missing
        }

        try {
          // Find the user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          // Check if the user exists
          if (!user) {
            console.error("User not found:", credentials.email);
            return null; // If user doesn't exist, return null
          }

          // Compare the entered password with the stored hashed password
          const isPasswordValid = await compare(credentials.password, user.password);

          if (!isPasswordValid) {
            console.error("Invalid password for user:", credentials.email);
            return null; // If password doesn't match, return null
          }

          // Successfully authenticated, return the user object
          return user;
        } catch (error) {
          console.error("Error during authorization", error);
          return null; // In case of an error, return null
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    error: '/auth/error', // Custom error page for NextAuth.js
  },
};

export const GET = (req, res) => NextAuth(req, res, authOptions);

export const POST = (req, res) => NextAuth(req, res, authOptions);

// Gracefully disconnect Prisma client when the server shuts down (for serverless environments)
if (process.env.NODE_ENV === "production") {
  process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);  // Exit the process after disconnecting
  });
}
