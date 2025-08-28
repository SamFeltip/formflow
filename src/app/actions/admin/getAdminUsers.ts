"use server";

import { db } from "@/lib/drizzle/db";
import { users } from "@/lib/drizzle/schema";

export type AdminUser = Omit<
  typeof users.$inferSelect,
  "password_hash" | "updated_at"
> & {
  initials: string;
  activeTimelines: number;
};

export async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    const data = await db
      .select({
        id: users.id,
        name: users.name,
        avatar_url: users.avatar_url,
        role: users.role,
        email: users.email,
        created_at: users.created_at,
      })
      .from(users);

    return data.map((user) => ({
      ...user,
      initials: user.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
        : "",
      activeTimelines: 0, // This needs to be fetched or calculated if required
    }));
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return [];
  }
}
