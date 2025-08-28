import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { admin, ac, user, myCustomRole } from "@/auth/permissions";

export const authClient = createAuthClient({
  plugins: [
    adminClient({
      ac,
      roles: {
        admin,
        user,
        myCustomRole,
      },
    }),
  ],
});
