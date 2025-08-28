import { getCurrentUser } from "@/lib/get-user";
import { db } from "@/lib/drizzle/db";
import { eq, inArray } from "drizzle-orm";

import {
  approverUserRelationships,
  userTimelineAssignments,
  submissions,
  forms,
  timelines,
  users,
} from "@/lib/drizzle/schema";

type SubmittedBy = typeof users.$inferSelect & {
  initials: string;
};

export type PendingForm = Omit<
  typeof submissions.$inferSelect,
  | "form_id"
  | "timeline_id"
  | "user_id"
  | "values"
  | "approved_at"
  | "submitted_at"
> & {
  name: string;
  timelineTitle: string;
  submittedBy: SubmittedBy;
  submittedDate: string | null;
  daysAgo: number;
  submitted_at: Date | null;
};

export async function getApproverPendingForms(): Promise<PendingForm[]> {
  const user = await getCurrentUser();

  if (!user) {
    console.error("Error fetching user session: No user logged in");
    return [];
  }

  const approverId = user.id;

  // Get users assigned to this approver
  const relationships = await db
    .select({ user_id: approverUserRelationships.user_id })
    .from(approverUserRelationships)
    .where(eq(approverUserRelationships.approver_id, approverId));

  const assignedUserIds = relationships.map((rel) => rel.user_id);

  if (assignedUserIds.length === 0) {
    return []; // No users assigned to this approver, so no pending forms
  }

  // Get timelines assigned to these users
  const userTimelineAssignmentsData = await db
    .select({ timeline_id: userTimelineAssignments.timeline_id })
    .from(userTimelineAssignments)
    .where(inArray(userTimelineAssignments.user_id, assignedUserIds));

  const assignedTimelineIds = userTimelineAssignmentsData.map(
    (assignment) => assignment.timeline_id
  );

  if (assignedTimelineIds.length === 0) {
    return []; // No timelines assigned to these users, so no pending forms
  }

  const data = await db
    .select({
      id: submissions.id,
      submitted_at: submissions.submitted_at,
      priority: submissions.priority,
      forms: forms,
      timelines: timelines,
      users: users,
    })
    .from(submissions)
    .innerJoin(forms, eq(submissions.form_id, forms.id))
    .innerJoin(timelines, eq(submissions.timeline_id, timelines.id))
    .innerJoin(users, eq(submissions.user_id, users.id))
    .where(inArray(submissions.timeline_id, assignedTimelineIds));

  interface SubmissionWithRelations {
    id: string;
    submitted_at: Date | null;
    priority: string | null;
    forms: typeof forms.$inferSelect;
    timelines: typeof timelines.$inferSelect;
    users: typeof users.$inferSelect;
  }

  return data.map((submission) => ({
    ...submission,
    name: submission.forms?.name || "",
    timelineTitle: submission.timelines?.name || "",
    submittedBy: {
      ...submission.users,
      initials: submission.users?.name
        ? submission.users?.name
            .split(" ")
            .map((n) => n[0])
            .join("")
        : "",
    },
    submittedDate: submission.submitted_at
      ? new Date(submission.submitted_at).toLocaleDateString()
      : "",
    daysAgo: submission.submitted_at
      ? Math.floor(
          (new Date().getTime() - new Date(submission.submitted_at).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0,
    priority: submission.priority || "normal",
  }));
}
