import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma), // Optional if you're using sessions stored in DB
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
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            throw new Error("No user found with this email.");
          }

          const isPasswordValid = await compare(password, user.password);
          if (!isPasswordValid) {
            throw new Error("Invalid password.");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            surname: user.surname,
            phone: user.phone,
            role: user.role,
            dateOfBirth: user.dateOfBirth?.toISOString() ?? null, // ✅ include it here too
          };
        } catch (error) {
          throw new Error("An unexpected error occurred. Please try again.");
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.phone = user.phone;
        token.role = user.role;
        token.dateOfBirth = user.dateOfBirth ?? null; // ✅ fix: include in token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.phone = token.phone;
      session.user.role = token.role;
      session.user.dateOfBirth = token.dateOfBirth; // ✅ now this will be available client-side
      return session;
    },
  },
  secret: process.env.JWT_SECRET,
  pages: {
    error: '/auth/error',
  },
};

// API route handlers
export async function GET(req, res) {
  return NextAuth(req, res, authOptions);
}

export async function POST(req, res) {
  return NextAuth(req, res, authOptions);
}
