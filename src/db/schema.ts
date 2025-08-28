import { integer, jsonb, pgTable, uuid } from "drizzle-orm/pg-core";
import { text, timestamp, boolean, pgSchema } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

const schema = pgSchema("schema");

export const users = schema.table("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const sessions = schema.table("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = schema.table("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verifications = schema.table("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

// ------

export const userRoleEnum = schema.enum("user_role", [
  "user",
  "approver",
  "admin",
]);

export const approverUserRelationshipTypeEnum = schema.enum(
  "approver_user_relationship_type",
  ["director", "supervisor", "manager"]
);
export const formFieldTypeEnum = schema.enum("form_field_type", [
  "text",
  "email",
  "textarea",
  "number",
  "tel",
  "url",
  "select",
  "checkbox",
]);
export const submissionStatusEnum = schema.enum("submission_status", [
  "pending",
  "submitted",
  "in_progress",
  "draft",
  "completed",
  "rejected",
  "approved",
]);
export const timelineScheduleUnitEnum = schema.enum("timeline_schedule_unit", [
  "never",
  "days",
  "weeks",
  "months",
  "years",
]);
export const timelineStartDateUnitEnum = schema.enum(
  "timeline_start_date_unit",
  ["days", "weeks", "months", "years"]
);

export const forms = schema.table("forms", {
  id: text("id").primaryKey(),
  created_at: timestamp("created_at").defaultNow(),
  created_by: uuid("created_by").references(() => users.id),
  description: text("description"),
  name: text("name").notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const formFields = schema.table("form_fields", {
  id: text("id").primaryKey(),
  form_id: uuid("form_id")
    .notNull()
    .references(() => forms.id),
  label: text("label").notNull(),
  options: jsonb("options"),
  placeholder: text("placeholder"),
  required: boolean("required").notNull(),
  type: formFieldTypeEnum("type").notNull(),
});

export const timelines = schema.table("timelines", {
  id: text("id").primaryKey(),
  created_at: timestamp("created_at").defaultNow(),
  created_by: uuid("created_by").references(() => users.id),
  description: text("description"),
  duration: text("duration"),
  form_id: uuid("form_id").references(() => forms.id),
  name: text("name").notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const approvers = schema.table("approvers", {
  id: text("id").primaryKey(),
  timeline_id: uuid("timeline_id")
    .notNull()
    .references(() => timelines.id),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id),
});

export const approverUserRelationships = schema.table(
  "approver_user_relationships",
  {
    id: text("id").primaryKey(),
    approver_id: uuid("approver_id")
      .notNull()
      .references(() => users.id),
    relationship_type:
      approverUserRelationshipTypeEnum("relationship_type").notNull(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id),
  }
);

export const submissions = schema.table("submissions", {
  id: text("id").primaryKey(),
  approved_at: timestamp("approved_at"),
  form_id: uuid("form_id")
    .notNull()
    .references(() => forms.id),
  priority: text("priority"),
  submitted_at: timestamp("submitted_at").defaultNow().notNull(),
  timeline_id: uuid("timeline_id")
    .notNull()
    .references(() => timelines.id),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id),
  values: jsonb("values"),
});

export const feedbackHistory = schema.table("feedback_history", {
  id: text("id").primaryKey(),
  message: text("message").notNull(),
  step: integer("step").notNull(),
  submission_id: uuid("submission_id")
    .notNull()
    .references(() => submissions.id),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const timelineForms = schema.table("timeline_forms", {
  id: text("id").primaryKey(),
  form_id: uuid("form_id")
    .notNull()
    .references(() => forms.id),
  schedule_amount: integer("schedule_amount").notNull(),
  schedule_unit: timelineScheduleUnitEnum("schedule_unit").notNull(),
  start_date_amount: integer("start_date_amount").notNull(),
  start_date_unit: timelineStartDateUnitEnum("start_date_unit").notNull(),
  timeline_id: uuid("timeline_id")
    .notNull()
    .references(() => timelines.id),
});

export const userTimelineAssignments = schema.table(
  "user_timeline_assignments",
  {
    id: text("id").primaryKey(),
    timeline_id: uuid("timeline_id")
      .notNull()
      .references(() => timelines.id),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id),
  }
);

export const workflowSteps = schema.table("workflow_steps", {
  id: text("id").primaryKey(),
  can_edit_fields: jsonb("can_edit_fields"),
  form_id: uuid("form_id")
    .notNull()
    .references(() => forms.id),
  name: text("name").notNull(),
  required: boolean("required").notNull(),
  role_id: text("role_id").notNull(), // This might need to be a foreign key to a roles table if one exists
});
