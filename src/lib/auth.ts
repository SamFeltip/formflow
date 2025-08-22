import NextAuth, { Profile } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { accounts, sessions, users, verificationTokens } from "@/db/schema";
import { registerCredentials, saltAndHashPassword } from "@/utils/pasword";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    accountsTable: accounts,
    usersTable: users,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // profile(profile) {
      //   return { role: profile.role ?? "user", ...profile };
      // },
      authorize: async (credentials) => {
        let user = null;

        if (credentials == undefined) {
          throw new Error("No credentials provided.");
        }

        user = await db.query.users.findFirst({
          with: {
            emails: credentials?.email,
          },
        });

        if (!user) {
          // No user found, so this is their first attempt to login

          return await registerCredentials(credentials);
        }

        // return user object with their profile data
        return user;
      },
    }),
  ],
  callbacks: {
    session: ({ session, user, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        role: token.role,
      },
    }),
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});
