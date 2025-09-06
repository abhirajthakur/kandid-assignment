import { sql } from "drizzle-orm";
import {
  check,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const leadStatusEnum = pgEnum("lead_status", [
  "pending",
  "contacted",
  "responded",
  "converted",
]);

export const campaignStatusEnum = pgEnum("campaign_status", [
  "draft",
  "active",
  "paused",
  "completed",
]);

export const leadsTable = pgTable("leads", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  company: varchar({ length: 255 }).notNull(),
  campaignName: varchar({ length: 255 }).notNull(),
  status: leadStatusEnum().default("pending"),
  lastContactDate: timestamp("last_contact_date", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
});

export const campaignTable = pgTable(
  "campaigns",
  {
    id: uuid().defaultRandom().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    status: campaignStatusEnum().default("active"),
    totalLeads: integer().notNull(),
    successfulLeads: integer().notNull(),
    responseRate: integer(),
  },
  (table) => [
    check(
      "response_rate_percentage",
      sql`${table.responseRate} >= 0 AND ${table.responseRate} <= 100`,
    ),
  ],
);
