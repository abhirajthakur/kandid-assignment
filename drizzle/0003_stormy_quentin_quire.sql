ALTER TABLE "campaigns" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "company" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "campaignName" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "title" text NOT NULL;