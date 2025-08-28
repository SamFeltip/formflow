"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/drizzle/db";
import {
  approverUserRelationshipTypeEnum,
  approverUserRelationships,
  userTimelineAssignments,
  timelines,
  users,
} from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/get-user";
import { TeamMember, TeamMemberWithApprovers } from "./user/getApprovers";
import { processTeamRelationships } from "@/lib/team-members-utils";

export async function assignUserToApprover(payload: {
  approver_id: string;
  user_id: string;
  relationship_type: (typeof approverUserRelationshipTypeEnum.enumValues)[number];
}) {
  const { approver_id, user_id, relationship_type } = payload;

  try {
    const [data] = await db
      .insert(approverUserRelationships)
      .values({
        approver_id,
        user_id,
        relationship_type,
      })
      .returning();

    revalidatePath("/team");
    return data;
  } catch (error) {
    console.error("Error assigning user to approver:", error);
    throw error;
  }
}

export async function assignTimelineToUser(payload: {
  user_id: string;
  timeline_id: string;
}) {
  const { user_id, timeline_id } = payload;

  try {
    const [data] = await db
      .insert(userTimelineAssignments)
      .values([{ user_id, timeline_id }])
      .returning();

    revalidatePath("/timelines");
    return data;
  } catch (error) {
    console.error("Error assigning timeline to user:", error);
    throw error;
  }
}

export async function getMyAssignedUsers(): Promise<TeamMemberWithApprovers[]> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Error: No user logged in");
  }

  const data = await db
    .select({
      approver_id: approverUserRelationships.approver_id,
      user_id: approverUserRelationships.user_id,
      user: users,
    })
    .from(approverUserRelationships)
    .innerJoin(users, eq(approverUserRelationships.user_id, users.id))
    .where(eq(approverUserRelationships.approver_id, user.id));

  const relationshipsData = await db
    .select({
      approver_id: approverUserRelationships.approver_id,
      user_id: approverUserRelationships.user_id,
    })
    .from(approverUserRelationships);

  const d = data.map((item) => ({
    ...item.user,
    initials: (item.user.name || "")
      .split(" ")
      .map((n) => n[0])
      .join(""),
    approvers: [],
    users: [],
  }));

  return processTeamRelationships(d, relationshipsData);
}

export async function getApproversList(): Promise<TeamMemberWithApprovers[]> {
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
      .from(users)
      .where(eq(users.role, "approver"));

    return data.map((approver) => ({
      ...approver,
      initials: approver.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase(),
      approvers: [], // Initialize as empty array
      users: [], // Initialize as empty array
    }));
  } catch (error) {
    console.error("Error fetching approvers:", error);
    return [];
  }
}

export async function getTimelinesList() {
  try {
    const data = await db.select().from(timelines);

    return data;
  } catch (error) {
    console.error("Error fetching timelines:", error);
    return [];
  }
}
