"use server";

import { db } from "@/lib/drizzle/db";
import { userTimelineAssignments, submissions } from "@/lib/drizzle/schema";
import { getCurrentUser } from "@/lib/get-user";
import { eq } from "drizzle-orm";

type FormValues = (typeof submissions.$inferSelect)["values"];

export async function submitForm(
  timeline_id: string,
  form_id: string,
  formValues: FormValues
) {
  const user = await getCurrentUser();

  if (!user) {
    console.error("Error fetching user session:");
    return { success: false, error: "User not authenticated." };
  }

  const userId = user.id;

  // Check if the user is assigned to this timeline
  const assignmentData = await db
    .select({ id: userTimelineAssignments.id })
    .from(userTimelineAssignments)
    .where(
      eq(userTimelineAssignments.user_id, userId) &&
        eq(userTimelineAssignments.timeline_id, timeline_id)
    )
    .limit(1);

  if (!assignmentData || assignmentData.length === 0) {
    console.error(
      "User not assigned to this timeline:",
      "No assignment found."
    );
    return { success: false, error: "User is not assigned to this timeline." };
  }

  try {
    await db
      .insert(submissions)
      .values({
        user_id: userId,
        timeline_id: timeline_id,
        form_id: form_id,
        values: formValues,
      })
      .onConflictDoUpdate({
        target: [
          submissions.user_id,
          submissions.timeline_id,
          submissions.form_id,
        ],
        set: { values: formValues },
      });

    return { success: true, data: null };
  } catch (error) {
    console.error("Error submitting form:", error);
    return { success: false, error: error };
  }
}
