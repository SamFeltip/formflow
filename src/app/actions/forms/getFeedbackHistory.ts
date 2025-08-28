import { db } from "@/lib/drizzle/db";
import { submissions, feedbackHistory } from "@/lib/drizzle/schema";
import { eq, inArray, asc, InferSelectModel } from "drizzle-orm";

export type FeedbackHistory = typeof feedbackHistory.$inferSelect;

export async function getFormsFormIdfeedbackHistory(
  form_id: string
): Promise<FeedbackHistory[]> {
  const submissionsData = await db
    .select({ id: submissions.id })
    .from(submissions)
    .where(eq(submissions.form_id, form_id));

  if (!submissionsData || submissionsData.length === 0) {
    return [];
  }

  const submissionIds = submissionsData.map((s) => s.id);

  const feedbackHistoryData = await db
    .select({
      id: feedbackHistory.id,
      submission_id: feedbackHistory.submission_id,
      step: feedbackHistory.step,
      message: feedbackHistory.message,
      timestamp: feedbackHistory.timestamp,
    })
    .from(feedbackHistory)
    .where(inArray(feedbackHistory.submission_id, submissionIds))
    .orderBy(asc(feedbackHistory.timestamp));

  return feedbackHistoryData;
}
