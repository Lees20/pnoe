import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        if (!email || !password) {
          throw new Error("Please enter both email and password.");
        }

        try {
          // Find the user by email
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            throw new Error("No user found with this email.");
          }

          // Compare the password
          const isPasswordValid = await compare(password, user.password);
          if (!isPasswordValid) {
            throw new Error("Invalid password.");
          }

          // Return user object with role
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            surname: user.surname,
            phone: user.phone,
            role: user.role,  // Include role here
          };
        } catch (error) {
          throw new Error("An unexpected error occurred. Please try again.");
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt', // Enable JWT strategy
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.phone = user.phone; // Make sure phone is included
        token.role = user.role;   // Add role to the token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.phone = token.phone; // Ensure phone is added to the session
      session.user.role = token.role;   // Ensure role is included in the session
      return session;
    },
  },
  
  secret: process.env.JWT_SECRET, // Keep this for JWT if needed
  pages: {
    error: '/auth/error', // Redirect to a custom error page if there's an error
  },
};

// Named exports for GET and POST methods
export async function GET(req, res) {
  return NextAuth(req, res, authOptions);
}

export async function POST(req, res) {
  return NextAuth(req, res, authOptions);
}
