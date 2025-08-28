import { db } from "@/lib/drizzle/db";
import {
  userTimelineAssignments,
  timelines,
  forms,
} from "@/lib/drizzle/schema";
import { eq, count } from "drizzle-orm";

export async function getUserTimelines(userId: string) {
  const data = await db
    .select({
      id: timelines.id,
      name: timelines.name,
      description: timelines.description,
      duration: timelines.duration,
      formCount: count(forms.id),
    })
    .from(userTimelineAssignments)
    .innerJoin(timelines, eq(userTimelineAssignments.timeline_id, timelines.id))
    .leftJoin(forms, eq(timelines.form_id, forms.id))
    .where(eq(userTimelineAssignments.user_id, userId))
    .groupBy(
      timelines.id,
      timelines.name,
      timelines.description,
      timelines.duration
    );

  return data.map((timeline) => ({
    ...timeline,
    formCount: timeline.formCount || 0,
  }));
}
