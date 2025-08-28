import { db } from "@/lib/drizzle/db";
import { userTimelineAssignments, timelines, timelineForms, forms } from "@/lib/drizzle/schema";
import { eq, inArray } from "drizzle-orm";

export type UserTimeline = {
  id: string;
  name: string;
  description: string | null;
  duration: string | null;
  forms: Array<{
    form: {
      id: string;
      name: string;
      description: string | null;
    };
  }>;
};

export async function getUserTimelines(userId: string): Promise<UserTimeline[]> {
  // 1. Get timeline IDs assigned to the user
  const assignments = await db.select({ timeline_id: userTimelineAssignments.timeline_id })
    .from(userTimelineAssignments)
    .where(eq(userTimelineAssignments.user_id, userId));

  const timelineIds = assignments.map((a) => a.timeline_id);

  if (timelineIds.length === 0) {
    return [];
  }

  // 2. Get timeline details and their associated forms
  const timelinesData = await db.select({
    id: timelines.id,
    name: timelines.name,
    description: timelines.description,
    duration: timelines.duration,
    form_id: forms.id,
    form_name: forms.name,
    form_description: forms.description,
  })
  .from(timelines)
  .leftJoin(timelineForms, eq(timelines.id, timelineForms.timeline_id))
  .leftJoin(forms, eq(timelineForms.form_id, forms.id))
  .where(inArray(timelines.id, timelineIds));

  const userTimelinesMap = new Map<string, UserTimeline>();

  timelinesData.forEach(row => {
    let timeline = userTimelinesMap.get(row.id);
    if (!timeline) {
      timeline = {
        id: row.id,
        name: row.name,
        description: row.description || null,
        duration: row.duration || null,
        forms: [],
      };
      userTimelinesMap.set(row.id, timeline);
    }

    if (row.form_id) {
      timeline.forms.push({
        form: {
          id: row.form_id,
          name: row.form_name || "",
          description: row.form_description || null,
        },
      });
    }
  });

  return Array.from(userTimelinesMap.values());
}
