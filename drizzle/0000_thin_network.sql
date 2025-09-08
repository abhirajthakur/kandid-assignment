CREATE TYPE "public"."campaign_status" AS ENUM('draft', 'active', 'paused', 'completed');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('pending', 'contacted', 'responded', 'converted');--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"status" "campaign_status" DEFAULT 'active',
	"totalLeads" integer NOT NULL,
	"successfulLeads" integer NOT NULL,
	"responseRate" integer,
	CONSTRAINT "response_rate_percentage" CHECK ("campaigns"."responseRate" >= 0 AND "campaigns"."responseRate" <= 100)
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"company" varchar(255) NOT NULL,
	"campaignName" varchar(255) NOT NULL,
	"status" "lead_status" DEFAULT 'pending',
	"last_contact_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "leads_email_unique" UNIQUE("email")
);
