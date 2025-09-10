ALTER TABLE "leads" ADD COLUMN "campaignId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_campaignId_campaigns_id_fk" FOREIGN KEY ("campaignId") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" DROP COLUMN "campaignName";