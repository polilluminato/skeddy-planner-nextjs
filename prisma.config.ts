import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma Migrate usa la connessione diretta; il runtime usa DATABASE_URL (pooled) via adapter.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DIRECT_URL,
  },
});
