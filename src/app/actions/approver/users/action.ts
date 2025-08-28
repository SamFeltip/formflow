import { db } from "@/lib/drizzle/db";
import { timelines, submissions, users } from "@/lib/drizzle/schema";
import { eq, InferSelectModel } from "drizzle-orm";

export type ApproverUser = Omit<
  typeof users.$inferSelect,
  "email" | "role" | "created_at" | "password_hash" | "updated_at"
> & {
  initials: string;
  currentTimeline: string;
  progress: number;
  nextFormDue: string;
  daysRemaining: number;
  hasOverdue: boolean;
};

export async function getApproverUsers(): Promise<ApproverUser[]> {
  const data = await db
    .select({
      id: users.id,
      name: users.name,
      avatar_url: users.avatar_url,
      timelineId: timelines.id,
      timelineName: timelines.name,
      submissionSubmittedAt: submissions.submitted_at,
    })
    .from(users)
    .leftJoin(timelines, eq(users.id, timelines.created_by))
    .leftJoin(submissions, eq(users.id, submissions.user_id));

  const usersMap = new Map<string, ApproverUser>();

  data.forEach((row) => {
    let user = usersMap.get(row.id);
    if (!user) {
      user = {
        id: row.id,
        name: row.name || "",
        avatar_url: row.avatar_url || "",
        initials: row.name
          ? row.name
              .split(" ")
              .map((n) => n[0])
              .join("")
          : "",
        currentTimeline: "N/A",
        progress: 0,
        nextFormDue: "N/A",
        daysRemaining: 0,
        hasOverdue: false,
      };
      usersMap.set(row.id, user);
    }

    if (row.timelineName && user.currentTimeline === "N/A") {
      user.currentTimeline = row.timelineName;
    }

    // This logic for progress, nextFormDue, daysRemaining, hasOverdue needs to be re-evaluated
    // based on how these are calculated with Drizzle. For now, keeping them as placeholders.
    // The original code also had placeholders for these values.
  });

  const usersValues = Array.from(usersMap.values());

  const filteredUsers = usersValues?.filter((user) => {
    return true; // active shows all
  });

  return filteredUsers;
}
