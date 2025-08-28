"use server";

import { db } from "@/lib/drizzle/db";
import { forms, workflowSteps } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type WorkflowStepInsert = typeof workflowSteps.$inferInsert;

export type FormDetails = InferSelectModel<typeof forms>;
export type NewForm = InferInsertModel<typeof forms> & {
  workflowSteps?: WorkflowStepInsert[];
};

export async function postForm(newForm: NewForm): Promise<FormDetails> {
  const data = await db
    .insert(forms)
    .values({
      name: newForm.name,
      description: newForm.description,
    })
    .returning();

  if (!data || data.length === 0) {
    throw new Error("Failed to create form.");
  }

  const result = data[0];

  return result;
}

export async function putForm(
  id: string,
  updatedForm: NewForm
): Promise<FormDetails> {
  const data = await db
    .update(forms)
    .set({
      name: updatedForm.name,
      description: updatedForm.description,
    })
    .where(eq(forms.id, id))
    .returning();

  if (!data || data.length === 0) {
    throw new Error("Failed to update form.");
  }

  const result = data[0];

  return result;
}

export async function saveFormAction(
  id: string,
  formTitle: string,
  formDescription: string | null,
  workflowSteps: WorkflowStepInsert[]
): Promise<FormDetails> {
  const isNewForm = id === "new";

  const newFormSubmitted: NewForm = {
    name: formTitle,
    description: formDescription,
    workflowSteps: workflowSteps,
  };

  let newForm: FormDetails;
  if (isNewForm) {
    newForm = await postForm(newFormSubmitted);
  } else {
    newForm = await putForm(id, newFormSubmitted);
  }

  return newForm;
}
