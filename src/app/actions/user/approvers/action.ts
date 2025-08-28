import { db } from "@/lib/drizzle/db";
import { eq } from "drizzle-orm";
import { TeamMember } from "../getApprovers";
import { users } from "@/lib/drizzle/schema";

export async function getUserApprovers(): Promise<TeamMember[]> {
  try {
    const data = await db
      .select({
        id: users.id,
        name: users.name,
        role: users.role,
        avatar_url: users.avatar_url,
        email: users.email,
        created_at: users.created_at,
      })
      .from(users)
      .where(eq(users.role, "approver"));

    return data.map((user) => ({
      ...user,
      initials: (user.name || "")
        .split(" ")
        .map((n) => n[0])
        .join(""),
      approvers: [],
      users: [],
    }));
  } catch (error) {
    console.error("Error fetching user approvers:", error);
    return [];
  }
}
