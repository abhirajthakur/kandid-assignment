import { db } from "@/db";
import * as schema from "@/db/schema";
import { seed } from "drizzle-seed";

async function seedDatabase() {
  console.log("🌱 Seeding database with sample data...");

  console.log("🧹 Clearing existing data...");
  await db.delete(schema.leadsTable);
  await db.delete(schema.campaignTable);
  console.log("✅ Cleared existing data");

  await seed(db, { campaigns: schema.campaignTable }, { seed: 100 }).refine(
    (f) => ({
      campaigns: {
        columns: {
          responseRate: f.int({ minValue: 1, maxValue: 100 }),
        },
        count: 100,
      },
    }),
  );
  console.log("✅ Seeded the campaigns table");

  await seed(db, { leads: schema.leadsTable }, { seed: 100 });
  console.log("✅ Seeded the leads table");

  console.log("🌱 Seeding completed.");
}

seedDatabase()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
