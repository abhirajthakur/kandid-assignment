// Load environment variables only in Node.js runtime (not edge)
if (typeof window === "undefined") {
  require("dotenv/config");
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
};
