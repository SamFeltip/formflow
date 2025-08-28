import { db } from "@/lib/drizzle/db";
import { timelines, timelineForms, submissions } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

export type UserTimeline = {
  id: string;
  name: string;
  nextFormDue: string;
  progress: number;
  totalForms: number;
  completedForms: number;
};

export async function getCurrentUserTimelines(): Promise<UserTimeline[]> {
  const data = await db.select({
    id: timelines.id,
    name: timelines.name,
    timelineFormId: timelineForms.form_id,
    timelineFormStartDateAmount: timelineForms.start_date_amount,
    timelineFormStartDateUnit: timelineForms.start_date_unit,
    submissionId: submissions.id,
  })
  .from(timelines)
  .leftJoin(timelineForms, eq(timelines.id, timelineForms.timeline_id))
  .leftJoin(submissions, eq(timelines.id, submissions.timeline_id));

  const timelineMap = new Map<string, UserTimeline>();

  data.forEach(row => {
    let timeline = timelineMap.get(row.id);
    if (!timeline) {
      timeline = {
        id: row.id,
        name: row.name || "",
        nextFormDue: "N/A",
        progress: 0,
        totalForms: 0,
        completedForms: 0,
      };
      timelineMap.set(row.id, timeline);
    }

    if (row.timelineFormId) {
      timeline.totalForms++;
      // Simplified logic for nextFormDue, needs more robust date calculation
      const date = new Date();
      if (row.timelineFormStartDateUnit === "days") {
        date.setDate(date.getDate() + (row.timelineFormStartDateAmount || 0));
      } else if (row.timelineFormStartDateUnit === "weeks") {
        date.setDate(date.getDate() + (row.timelineFormStartDateAmount || 0) * 7);
      } else if (row.timelineFormStartDateUnit === "months") {
        date.setMonth(date.getMonth() + (row.timelineFormStartDateAmount || 0));
      } else if (row.timelineFormStartDateUnit === "years") {
        date.setFullYear(date.getFullYear() + (row.timelineFormStartDateAmount || 0));
      }
      timeline.nextFormDue = date.toLocaleDateString();
    }

    if (row.submissionId) {
      timeline.completedForms++;
    }
  });

  return Array.from(timelineMap.values()).map(timeline => ({
    ...timeline,
    progress: timeline.totalForms > 0 ? Math.round((timeline.completedForms / timeline.totalForms) * 100) : 0,
  }));
}
