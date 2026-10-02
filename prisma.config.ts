import { defineConfig } from "prisma/config";

// In CI/Vercel non c'è .env: le variabili arrivano dall'ambiente.
try {
  process.loadEnvFile();
} catch {}

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
