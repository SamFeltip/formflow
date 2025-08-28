import { db } from "@/lib/drizzle/db";
import { formFields } from "@/lib/drizzle/schema";
import { eq, InferSelectModel } from "drizzle-orm";

export type FormField = Omit<InferSelectModel<typeof formFields>, "form_id"> & {
  options: string[] | null;
};

export async function getFormsFormIdFields(form_id: string): Promise<FormField[]> {
  const data = await db.select({
    id: formFields.id,
    type: formFields.type,
    label: formFields.label,
    placeholder: formFields.placeholder,
    required: formFields.required,
    options: formFields.options,
  })
  .from(formFields)
  .where(eq(formFields.form_id, form_id));

  return data.map((field) => ({
    id: field.id,
    type: field.type,
    label: field.label,
    placeholder: field.placeholder,
    required: field.required,
    options: field.options as string[] | null,
  }));
}
