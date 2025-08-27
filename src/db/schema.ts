import {
  pgTable,
  serial,
  text,
  timestamp,
  primaryKey,
  integer,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

export const users = pgTable("users", {
  id: uuid("id")
    .default(sql`uuid_generate_v7()`)
    .primaryKey()
    .defaultRandom(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  passwordHash: text("passwordHash"),
  role: text("role").default("user").notNull(),
});
