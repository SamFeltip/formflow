"use server";

import { db } from "@/lib/drizzle/db";
import { users } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

export type TeamMember = {
  id: string;
  name: string;
  avatar_url: string;
  role: "user" | "approver" | "admin";
  email: string;
  initials: string;
};

export async function getApproverTeamMembers(): Promise<TeamMember[]> {
  const data = await db
    .select({
      id: users.id,
      name: users.name,
      avatar_url: users.avatar_url,
      role: users.role,
      email: users.email,
    })
    .from(users)
    .where(eq(users.role, "approver"));

  return data.map((user) => ({
    ...user,
    initials: user.name
      ? user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
      : "",
  }));
}
