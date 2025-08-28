import { db } from "@/lib/drizzle/db";
import { workflowSteps } from "@/lib/drizzle/schema";
import { eq, asc } from "drizzle-orm";

export type WorkflowStep = typeof workflowSteps.$inferSelect;

export async function getFormsFormIdWorkflowSteps(
  form_id: string
): Promise<WorkflowStep[]> {
  const data = await db
    .select({
      id: workflowSteps.id,
      name: workflowSteps.name,
      role_id: workflowSteps.role_id,
      form_id: workflowSteps.form_id,
      can_edit_fields: workflowSteps.can_edit_fields,
      required: workflowSteps.required,
    })
    .from(workflowSteps)
    .where(eq(workflowSteps.form_id, form_id))
    .orderBy(asc(workflowSteps.name));

  return data;
}

export async function updateFormsFormIdWorkflowSteps(
  form_id: string,
  deletingWorkflowSteps: WorkflowStep[]
) {
  // await db
  //   .delete(deletingWorkflowSteps)
  //   .where(eq(workflowSteps.form_id, form_id));

  // const workflowStepsToInsert = deletingWorkflowSteps.map((step) => ({
  //   form_id: form_id,
  //   name: step.name,
  //   role_id: step.roleId,
  //   can_edit_fields: step.canEditFields,
  //   required: step.required,
  // }));

  // await db.insert(deletingWorkflowSteps).values(workflowStepsToInsert);

  throw new Error("not implemented");
}
