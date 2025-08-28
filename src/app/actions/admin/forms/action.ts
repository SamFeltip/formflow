import { db } from "@/lib/drizzle/db";
import { forms, submissions, formFields } from "@/lib/drizzle/schema";
import { sql, eq } from "drizzle-orm";

export type AdminForm = typeof forms.$inferSelect & {
  fields: number;
  submissions: number;
};

export async function getAdminForms(): Promise<AdminForm[]> {
  try {
    const data = await db
      .select({
        id: forms.id,
        name: forms.name,
        description: forms.description,
        created_at: forms.created_at,
        created_by: forms.created_by,
        updated_at: forms.updated_at,
        submissions: sql<number>`count(DISTINCT ${submissions.id})`,
        fields: sql<number>`count(DISTINCT ${formFields.id})`,
      })
      .from(forms)
      .leftJoin(submissions, eq(forms.id, submissions.form_id))
      .leftJoin(formFields, eq(forms.id, formFields.form_id))
      .groupBy(forms.id, forms.name, forms.description);

    return data.map((form) => ({
      ...form,
      description: form.description || "",
    }));
  } catch (error) {
    console.error("Error fetching admin forms:", error);
    return [];
  }
}