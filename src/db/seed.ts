import { db } from "@/db";
import * as schema from "@/db/schema";
import { seed } from "drizzle-seed";

async function seedDatabase() {
  console.log("🧹 Clearing existing data...");
  await db.delete(schema.leadsTable);
  await db.delete(schema.campaignTable);
  console.log("✅ Cleared existing data");

  console.log("🌱 Seeding database with sample data...");

  await seed(db, { campaigns: schema.campaignTable }).refine((f) => ({
    campaigns: {
      columns: {
        name: f.loremIpsum({ sentencesCount: 1 }),
        responseRate: f.int({ minValue: 1, maxValue: 100 }),
        totalLeads: f.int({ minValue: 10, maxValue: 200 }),
        successfulLeads: f.int({ minValue: 1, maxValue: 50 }),
        status: f.valuesFromArray({
          values: schema.campaignStatusEnum.enumValues,
        }),
      },
      count: 25,
    },
  }));

  console.log("✅ Seeded the campaigns table");

  const campaigns = await db
    .select({ id: schema.campaignTable.id })
    .from(schema.campaignTable);
  const campaignIds = campaigns.map((c) => c.id);

  await seed(db, { leads: schema.leadsTable }).refine((f) => ({
    leads: {
      columns: {
        name: f.fullName(),
        email: f.email(),
        company: f.companyName(),
        title: f.jobTitle(),
        campaignId: f.valuesFromArray({ values: campaignIds }),
        status: f.valuesFromArray({
          values: schema.leadStatusEnum.enumValues,
        }),
      },
      count: 500,
    },
  }));

  console.log("✅ Seeded the leads table with proper campaign relationships");
  console.log("🌱 Seeding completed.");
}

seedDatabase()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
