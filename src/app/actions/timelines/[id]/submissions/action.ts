import { db } from "@/lib/drizzle/db";
import { submissions } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

export type FormSubmissionStatus = Pick<
  typeof submissions.$inferSelect,
  "form_id" | "submitted_at"
>;

export async function getTimelineSubmissions(
  id: string
): Promise<FormSubmissionStatus[]> {
  const data = await db
    .select({
      form_id: submissions.form_id,
      submitted_at: submissions.submitted_at,
    })
    .from(submissions)
    .where(eq(submissions.timeline_id, id));

  return data.map((submission) => ({
    form_id: submission.form_id,
    submitted_at: submission.submitted_at,
  }));
}
