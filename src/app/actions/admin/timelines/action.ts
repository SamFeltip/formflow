import { db } from "@/lib/drizzle/db";
import { forms, timelines, timelineForms } from "@/lib/drizzle/schema";
import { eq, InferSelectModel } from "drizzle-orm";

export type AdminTimeline = Omit<
  typeof timelines.$inferSelect,
  "created_at" | "created_by" | "updated_at" | "form_id"
> & {
  formCount: number;
  forms: InferSelectModel<typeof forms>[];
};

export async function getAdminTimelines(): Promise<AdminTimeline[]> {
  const data = await db
    .select({
      id: timelines.id,
      name: timelines.name,
      description: timelines.description,
      duration: timelines.duration,
      forms: forms,
    })
    .from(timelines)
    .leftJoin(timelineForms, eq(timelines.id, timelineForms.timeline_id))
    .leftJoin(forms, eq(timelineForms.form_id, forms.id));

  const result = data.reduce((acc, row) => {
    const existingTimeline = acc.find((t) => t.id === row.id);
    if (existingTimeline) {
      if (row.forms) {
        existingTimeline.forms.push(row.forms);
      }
    } else {
      acc.push({
        id: row.id,
        name: row.name,
        description: row.description || "",
        duration: row.duration || "",
        formCount: row.forms ? 1 : 0,
        forms: row.forms ? [row.forms] : [],
      });
    }
    return acc;
  }, [] as AdminTimeline[]);

  return result.map((timeline) => ({
    ...timeline,
    formCount: timeline.forms.length,
  }));
}
