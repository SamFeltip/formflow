import { db } from "@/lib/drizzle/db";
import { submissions, forms, users } from "@/lib/drizzle/schema";
import { eq, InferSelectModel } from "drizzle-orm";

export type ApproverActivity = Omit<
  InferSelectModel<typeof submissions>,
  "form_id" | "timeline_id" | "user_id" | "values" | "approved_at" | "priority"
> & {
  formTitle: string;
  user: {
    name: string;
    avatar: string;
    initials: string;
  };
  timestamp: string;
};

export async function getRecentActivity(): Promise<ApproverActivity[]> {
  const data = await db
    .select({
      id: submissions.id,
      submitted_at: submissions.submitted_at,
      formName: forms.name,
      profileName: users.name,
      profileAvatarUrl: users.avatar_url,
    })
    .from(submissions)
    .leftJoin(forms, eq(submissions.form_id, forms.id))
    .leftJoin(users, eq(submissions.user_id, users.id));

  return data.map((submission) => ({
    id: submission.id,
    submitted_at: submission.submitted_at,
    formTitle: submission.formName || "",
    user: {
      name: submission.profileName || "",
      avatar: submission.profileAvatarUrl || "",
      initials: submission.profileName
        ? submission.profileName
            .split(" ")
            .map((n) => n[0])
            .join("")
        : "",
    },
    timestamp: new Date(submission.submitted_at).toLocaleString(),
  }));
}
