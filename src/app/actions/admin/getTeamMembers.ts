"use server";

import { db } from "@/lib/drizzle/db";
import { approverUserRelationships, users } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { processTeamRelationships } from "@/lib/team-members-utils";
import { TeamMember, TeamMemberWithApprovers } from "../user/getApprovers";

export async function getTeamMembers() {
  const profilesData = await db
    .select({
      id: users.id,
      name: users.name,
      role: users.role,
      avatar_url: users.avatar_url,
      email: users.email,
      created_at: users.created_at,
    })
    .from(users);

  const relationshipsData = await db
    .select({
      approver_id: approverUserRelationships.approver_id,
      user_id: approverUserRelationships.user_id,
    })
    .from(approverUserRelationships);

  const teamMembers: TeamMemberWithApprovers[] = profilesData.map(
    (profile) => ({
      id: profile.id,
      name: profile.name,
      avatar_url: profile.avatar_url,
      role: profile.role,
      email: profile.email,
      created_at: profile.created_at,
      initials: (profile.name || "")
        .split(" ")
        .map((n) => n[0])
        .join(""),
      approvers: [],
      users: [],
    })
  );

  processTeamRelationships(teamMembers, relationshipsData);

  return teamMembers;
}
