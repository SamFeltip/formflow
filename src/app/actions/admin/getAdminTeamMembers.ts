"use server";

import { db } from "@/lib/drizzle/db";
import { TeamMember } from "../user/getApprovers";
import { users } from "@/lib/drizzle/schema";

export async function getAdminTeamMembers(): Promise<TeamMember[]> {
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

    return data.map((user) => {
      return {
        ...user,
        initials: (user.name || "")
          .split(" ")
          .map((n) => n[0])
          .join(""),
      };
    });
  } catch (error) {
    console.error("Error fetching admin team members:", error);
    return [];
  }
}
