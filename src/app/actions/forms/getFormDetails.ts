import { db } from "@/lib/drizzle/db";
import { forms, submissions, timelines } from "@/lib/drizzle/schema";
import { and, eq } from "drizzle-orm";

export type FormDetails = {
  id: string;
  name: string;
  description: string | null;
};

export async function getFormDetails(
  form_id: string
): Promise<FormDetails | null> {
  let data;
  try {
    data = await db
      .select({
        id: forms.id,
        name: forms.name,
        description: forms.description,
      })
      .from(forms)
      .where(eq(forms.id, form_id))
      .limit(1);
  } catch (error) {
    console.error("Error fetching form details:", error);
    return null;
  }
  if (data.length === 0) {
    return null;
  }

  return {
    id: data[0].id,
    name: data[0].name,
    description: data[0].description ?? null,
  };
}

export async function getTimelineFormDetails(
  timeline_id: string,
  form_id: string
): Promise<(FormDetails & { timeline_id: string }) | null> {
  try {
    const result = await db
      .select({
        x: submissions.priority,
        id: forms.id,
        name: forms.name,
        description: forms.description,
        timeline_id: timelines.id,
      })
      .from(forms)
      .innerJoin(timelines, eq(forms.id, timelines.form_id))
      .where(and(eq(forms.id, form_id), eq(timelines.id, timeline_id)))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const data = result[0];

    return {
      id: data.id,
      name: data.name,
      description: data.description || null,
      timeline_id: data.timeline_id,
    };
  } catch (error) {
    console.error("Error fetching timeline form details:", error);
    return null;
  }
}
