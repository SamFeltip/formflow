import { db } from "@/lib/drizzle/db";
import { timelines, timelineForms } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

export type TimelineItem = {
  id: string;
  form_id: string;
  schedule: {
    amount: number;
    unit: "never" | "days" | "weeks" | "months" | "years";
  };
  startDate: {
    amount: number;
    unit: "days" | "weeks" | "months" | "years";
  };
};

export type Timeline = {
  id: string;
  name: string;
  description: string | null;
  duration: string | null;
  forms: TimelineItem[];
};

export type NewTimeline = {
  name: string;
  description?: string | null;
  duration?: string | null;
};

export async function getTimelineById(id: string): Promise<Timeline | null> {
  const timelineData = await db
    .select({
      id: timelines.id,
      name: timelines.name,
      description: timelines.description,
      duration: timelines.duration,
    })
    .from(timelines)
    .where(eq(timelines.id, id))
    .limit(1);

  if (!timelineData || timelineData.length === 0) {
    console.error("Error fetching timeline: No data found");
    return null;
  }

  const formsData = await db
    .select({
      id: timelineForms.id,
      form_id: timelineForms.form_id,
      start_date_amount: timelineForms.start_date_amount,
      start_date_unit: timelineForms.start_date_unit,
      schedule_amount: timelineForms.schedule_amount,
      schedule_unit: timelineForms.schedule_unit,
    })
    .from(timelineForms)
    .where(eq(timelineForms.timeline_id, id));

  return {
    id: timelineData[0].id,
    name: timelineData[0].name,
    description: timelineData[0].description || null,
    duration: timelineData[0].duration || null,
    forms: formsData.map((form) => ({
      id: form.id,
      form_id: form.form_id,
      startDate: {
        amount: form.start_date_amount,
        unit: form.start_date_unit,
      },
      schedule: {
        amount: form.schedule_amount,
        unit: form.schedule_unit,
      },
    })),
  };
}

export async function putTimeline(
  id: string,
  timelineUpdateData: NewTimeline,
  forms: TimelineItem[]
): Promise<Timeline | null> {
  await db
    .update(timelines)
    .set(timelineUpdateData)
    .where(eq(timelines.id, id));

  await db.delete(timelineForms).where(eq(timelineForms.timeline_id, id));

  const timelineFormsToInsert = forms.map((form) => ({
    timeline_id: id,
    form_id: form.form_id,
    start_date_amount: form.startDate.amount,
    start_date_unit: form.startDate.unit,
    schedule_amount: form.schedule.amount,
    schedule_unit: form.schedule.unit,
  }));

  await db.insert(timelineForms).values(timelineFormsToInsert);

  // Re-fetch the complete timeline details to return the updated state
  return getTimelineById(id);
}

export async function postNewTimeline(
  timelineInsertData: NewTimeline,
  forms: TimelineItem[]
): Promise<Timeline | null> {
  const insertedTimelineData = await db
    .insert(timelines)
    .values(timelineInsertData)
    .returning();

  if (!insertedTimelineData || insertedTimelineData.length === 0) {
    console.error("No data returned after creating timeline.");
    return null;
  }

  const newTimelineId = insertedTimelineData[0].id;

  // Insert timeline forms
  const timelineFormsToInsert = forms.map((form) => ({
    timeline_id: newTimelineId,
    form_id: form.form_id,
    start_date_amount: form.startDate.amount,
    start_date_unit: form.startDate.unit,
    schedule_amount: form.schedule.amount,
    schedule_unit: form.schedule.unit,
  }));

  await db.insert(timelineForms).values(timelineFormsToInsert);

  // Re-fetch the complete timeline details to return the updated state
  return getTimelineById(newTimelineId);
}
