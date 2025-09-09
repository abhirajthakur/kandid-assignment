import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

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
  name: text().notNull(),
  email: text().notNull().unique(),
  company: text().notNull(),
  title: text().notNull(),
  campaignId: uuid()
    .notNull()
    .references(() => campaignTable.id, { onDelete: "cascade" }),
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
    name: text().notNull(),
    status: campaignStatusEnum().default("active"),
    totalLeads: integer().notNull(),
    successfulLeads: integer().notNull(),
    responseRate: integer(),
    createdAt: timestamp("created_date", {
      withTimezone: true,
      mode: "date",
    }).defaultNow(),
  },
  (table) => [
    check(
      "response_rate_percentage",
      sql`${table.responseRate} >= 0 AND ${table.responseRate} <= 100`,
    ),
  ],
);

export const insertCampaignSchema = createInsertSchema(campaignTable);
export const updateCampaignSchema = createUpdateSchema(campaignTable);
export const insertLeadsSchema = createInsertSchema(leadsTable);
export const updateLeadsSchema = createUpdateSchema(leadsTable);
