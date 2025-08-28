import { db } from "@/lib/drizzle/db";
import { submissions } from "@/lib/drizzle/schema";
import { eq, desc, InferSelectModel } from "drizzle-orm";

export type FormValues = (typeof submissions.$inferSelect)["values"];

export async function getFormsFormIdvalues(
  form_id: string
): Promise<FormValues> {
  const data = await db
    .select({
      values: submissions.values,
    })
    .from(submissions)
    .where(eq(submissions.form_id, form_id))
    .orderBy(desc(submissions.submitted_at))
    .limit(1);

  if (!data || data.length === 0) {
    console.error("No form values found.");
    return {};
  }

  return data[0].values;
}
