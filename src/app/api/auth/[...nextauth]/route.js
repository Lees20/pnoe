import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const mockUser = {
          id: '1',
          name: 'Demo User',
          email: 'demo@user.com',
          password: 'demo123',
        };

        if (
          credentials.email === mockUser.email &&
          credentials.password === mockUser.password
        ) {
          return { id: mockUser.id, name: mockUser.name, email: mockUser.email };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login', // custom login page
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
