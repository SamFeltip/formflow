import { integer, jsonb, pgEnum, pgTable } from "drizzle-orm/pg-core";
import { text, timestamp, boolean } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "approver", "admin"]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image")
    .notNull()
    .default("https://randomuser.me/api/portraits/men/1.jpg"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role").notNull().default("user"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const sessions = pgTable("sessions", {
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
  impersonatedBy: text("impersonated_by"),
});

export const accounts = pgTable("accounts", {
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

export const verifications = pgTable("verifications", {
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

export const approverUserRelationshipTypeEnum = pgEnum(
  "approver_user_relationship_type",
  ["director", "supervisor", "manager"]
);
export const formFieldTypeEnum = pgEnum("form_field_type", [
  "text",
  "email",
  "textarea",
  "number",
  "tel",
  "url",
  "select",
  "checkbox",
]);
export const submissionStatusEnum = pgEnum("submission_status", [
  "pending",
  "submitted",
  "in_progress",
  "draft",
  "completed",
  "rejected",
  "approved",
]);
export const timelineScheduleUnitEnum = pgEnum("timeline_schedule_unit", [
  "never",
  "days",
  "weeks",
  "months",
  "years",
]);
export const timelineStartDateUnitEnum = pgEnum("timeline_start_date_unit", [
  "days",
  "weeks",
  "months",
  "years",
]);

export const forms = pgTable("forms", {
  id: text("id").primaryKey(),
  created_at: timestamp("created_at").defaultNow(),
  created_by: text("created_by").references(() => users.id),
  description: text("description"),
  name: text("name").notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const formFields = pgTable("form_fields", {
  id: text("id").primaryKey(),
  form_id: text("form_id")
    .notNull()
    .references(() => forms.id),
  label: text("label").notNull(),
  options: jsonb("options"),
  placeholder: text("placeholder"),
  required: boolean("required").notNull(),
  type: formFieldTypeEnum("type").notNull(),
});

export const timelines = pgTable("timelines", {
  id: text("id").primaryKey(),
  created_at: timestamp("created_at").defaultNow(),
  created_by: text("created_by").references(() => users.id),
  description: text("description"),
  duration: text("duration"),
  form_id: text("form_id").references(() => forms.id),
  name: text("name").notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const approvers = pgTable("approvers", {
  id: text("id").primaryKey(),
  timeline_id: text("timeline_id")
    .notNull()
    .references(() => timelines.id),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id),
});

export const approverUserRelationships = pgTable(
  "approver_user_relationships",
  {
    id: text("id").primaryKey(),
    approver_id: text("approver_id")
      .notNull()
      .references(() => users.id),
    relationship_type:
      approverUserRelationshipTypeEnum("relationship_type").notNull(),
    user_id: text("user_id")
      .notNull()
      .references(() => users.id),
  }
);

export const submissions = pgTable("submissions", {
  id: text("id").primaryKey(),
  approved_at: timestamp("approved_at"),
  form_id: text("form_id")
    .notNull()
    .references(() => forms.id),
  priority: text("priority"),
  submitted_at: timestamp("submitted_at").defaultNow().notNull(),
  timeline_id: text("timeline_id")
    .notNull()
    .references(() => timelines.id),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id),
  values: jsonb("values"),
});

export const feedbackHistory = pgTable("feedback_history", {
  id: text("id").primaryKey(),
  message: text("message").notNull(),
  step: integer("step").notNull(),
  submission_id: text("submission_id")
    .notNull()
    .references(() => submissions.id),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const timelineForms = pgTable("timeline_forms", {
  id: text("id").primaryKey(),
  form_id: text("form_id")
    .notNull()
    .references(() => forms.id),
  schedule_amount: integer("schedule_amount").notNull(),
  schedule_unit: timelineScheduleUnitEnum("schedule_unit").notNull(),
  start_date_amount: integer("start_date_amount").notNull(),
  start_date_unit: timelineStartDateUnitEnum("start_date_unit").notNull(),
  timeline_id: text("timeline_id")
    .notNull()
    .references(() => timelines.id),
});

export const userTimelineAssignments = pgTable("user_timeline_assignments", {
  id: text("id").primaryKey(),
  timeline_id: text("timeline_id")
    .notNull()
    .references(() => timelines.id),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id),
});

export const workflowSteps = pgTable("workflow_steps", {
  id: text("id").primaryKey(),
  can_edit_fields: jsonb("can_edit_fields"),
  form_id: text("form_id")
    .notNull()
    .references(() => forms.id),
  name: text("name").notNull(),
  required: boolean("required").notNull(),
  role_id: text("role_id").notNull(), // This might need to be a foreign key to a roles table if one exists
});
