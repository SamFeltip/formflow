import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin as adminPlugin } from "better-auth/plugins";

import { db } from "@/db"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";
import * as schema from "@/db/schema";
import { ac, admin, user } from "@/auth/permissions";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    usePlural: true,
    provider: "pg",
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    nextCookies(),
    adminPlugin({
      ac,
      roles: {
        admin,
        user,
      },
    }),
  ],
});
