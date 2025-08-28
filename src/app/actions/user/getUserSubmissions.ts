import { db } from "@/lib/drizzle/db";
import { submissions, forms, timelines } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

export type UserSubmission = typeof submissions.$inferSelect & {
  form_name: string;
  timeline_name: string;
};

export async function getUserSubmissions(
  userId: string
): Promise<UserSubmission[]> {
  const data = await db
    .select({
      id: submissions.id,
      approved_at: submissions.approved_at,
      form_id: submissions.form_id,
      priority: submissions.priority,
      submitted_at: submissions.submitted_at,
      timeline_id: submissions.timeline_id,
      user_id: submissions.user_id,
      values: submissions.values,
      form_name: forms.name,
      timeline_name: timelines.name,
    })
    .from(submissions)
    .leftJoin(forms, eq(submissions.form_id, forms.id))
    .leftJoin(timelines, eq(submissions.timeline_id, timelines.id))
    .where(eq(submissions.user_id, userId));

  return data.map((submission) => ({
    ...submission,
    form_name: submission.form_name || "",
    timeline_name: submission.timeline_name || "",
  }));
}
