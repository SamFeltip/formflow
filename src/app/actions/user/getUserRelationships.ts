import { db } from "@/lib/drizzle/db";
import { approverUserRelationships, users } from "@/lib/drizzle/schema";
import { eq, or } from "drizzle-orm";
import { TeamMember } from "@/app/actions/user/getApprovers";
import { alias } from "drizzle-orm/pg-core";

export type UserRelationship = typeof approverUserRelationships.$inferSelect & {
  approver_profile: TeamMember;
  user_profile: TeamMember;
};

export async function getUserRelationships(
  userId: string
): Promise<UserRelationship[]> {
  try {
    const approver = alias(users, "approver");
    const user = alias(users, "user");

    const data = await db
      .select({
        approver_id: approverUserRelationships.approver_id,
        user_id: approverUserRelationships.user_id,
        relationship_type: approverUserRelationships.relationship_type,
        id: approverUserRelationships.id,
        approver_profile: {
          id: approver.id,
          name: approver.name,
          avatar_url: approver.avatar_url,
          role: approver.role,
          email: approver.email,
          created_at: approver.created_at,
        },
        user_profile: {
          id: users.id,
          name: users.name,
          avatar_url: users.avatar_url,
          role: users.role,
          email: users.email,
          created_at: users.created_at,
        },
      })
      .from(approverUserRelationships)
      .leftJoin(approver, eq(approverUserRelationships.approver_id, users.id))
      .leftJoin(user, eq(approverUserRelationships.user_id, users.id))
      .where(
        or(
          eq(approverUserRelationships.approver_id, userId),
          eq(approverUserRelationships.user_id, userId)
        )
      );

    return data.map((rel) => ({
      ...rel,
      approver_profile: {
        id: rel.approver_profile?.id || "",
        name: rel.approver_profile?.name || "",
        avatar_url: rel.approver_profile?.avatar_url || "",
        role: rel.approver_profile?.role || "user",
        email: rel.approver_profile?.email || "",
        created_at: rel.approver_profile?.created_at || null,
        initials: (rel.approver_profile?.name || "")
          .split(" ")
          .map((n: string) => n[0])
          .join(""),
      },
      user_profile: {
        id: rel.user_profile?.id || "",
        name: rel.user_profile?.name || "",
        avatar_url: rel.user_profile?.avatar_url || "",
        role: rel.user_profile?.role || "user",
        email: rel.user_profile?.email || "",
        created_at: rel.user_profile?.created_at || null,
        initials: (rel.user_profile?.name || "")
          .split(" ")
          .map((n: string) => n[0])
          .join(""),
      },
    }));
  } catch (error) {
    console.error("Error fetching user relationships:", error);
    return [];
  }
}
