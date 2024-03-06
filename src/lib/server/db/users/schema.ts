import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { USER_ID_LEN } from "../../../configs/fields-length";

export const users = sqliteTable("users", {
  id: text("id", { length: USER_ID_LEN }).notNull().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isVerified: integer("is_verified", { mode: "boolean" }).notNull().default(false),
  isAdmin: integer("is_admin", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  modifiedAt: integer("modified_at", { mode: "timestamp" })
});
