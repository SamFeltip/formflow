import { db } from "@/lib/drizzle/db";
import { users } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

export type TeamMember = {
  id: string;
  name: string;
  avatar_url: string;
  role: "user" | "approver" | "admin";
  initials: string;
};

export async function getApproverTeamMembers(): Promise<TeamMember[]> {
  const data = await db
    .select({
      id: users.id,
      name: users.name,
      role: users.role,
      avatar_url: users.avatar_url,
    })
    .from(users);

  return data.map((user) => ({
    ...user,
    name: user.name || "",
    role: user.role || "",
    avatar_url: user.avatar_url || "",
    initials: user.name
      ? user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
      : "",
  }));
}
