import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { loginAction, createOrUpdateOAuthUserAction } from '@/features/core/server-actions/auth/auth-actions';
import { RoleName } from '@/features/core/constants/roles.constants';

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const result = await loginAction(
          credentials.email as string,
          credentials.password as string
        );

        if (result.success && result.user) {
          return {
            id: result.user._id!,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
          };
        }

        return null;
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider === 'google') {
        const result = await createOrUpdateOAuthUserAction(
          user.email!,
          user.name || 'User',
          user.image
        );
        
        if (result.success && result.user) {
          user.id = result.user._id!;
          user.role = result.user.role;
        }
      }
      return true;
    },
    async jwt({ token, user, account }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role as RoleName;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as RoleName;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt' as const,
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);

export const { GET, POST } = handlers;

