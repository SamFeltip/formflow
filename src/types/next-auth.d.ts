import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null; // Add role property
    };
  }

  interface User {
    role?: string | null; // Add role property to User type as well
  }
}
