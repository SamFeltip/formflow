"use server";

import { db } from "@/lib/drizzle/db";
import {
  forms,
  timelineForms,
  timelines,
  userTimelineAssignments,
} from "@/lib/drizzle/schema";
import { getCurrentUser } from "@/lib/get-user";
import { eq } from "drizzle-orm";

export type UpcomingForm = {
  id: string;
  name: string;
  timelines: {
    id: string;
    name: string;
  }[];
  dueDate: string;
  daysRemaining: number;
};

export async function getCurrentUserUpcomingForms(): Promise<UpcomingForm[]> {
  const user = await getCurrentUser();

  if (user === null) {
    throw new Error("you must be authenticated to use this action");
  }

  const data = await db
    .select({
      id: forms.id,
      name: forms.name,
      timelineId: timelines.id,
      timelineName: timelines.name,
    })
    .from(forms)
    .leftJoin(timelineForms, eq(forms.id, timelineForms.form_id))
    .leftJoin(timelines, eq(timelineForms.timeline_id, timelines.id))
    .leftJoin(
      userTimelineAssignments,
      eq(timelines.id, userTimelineAssignments.timeline_id)
    )
    .where(eq(userTimelineAssignments.user_id, user.id));

  const formsMap = new Map<string, UpcomingForm>();

  data.forEach((row) => {
    let form = formsMap.get(row.id);
    if (!form) {
      form = {
        id: row.id,
        name: row.name || "",
        timelines: [],
        dueDate: "",
        daysRemaining: 0,
      };
      formsMap.set(row.id, form);
    }

    if (row.timelineId && row.timelineName) {
      form.timelines.push({
        id: row.timelineId,
        name: row.timelineName,
      });
    }
  });

  return Array.from(formsMap.values());
}
