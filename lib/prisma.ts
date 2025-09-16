import { PrismaClient } from "@prisma/client"

declare global {
  var __prisma: PrismaClient | undefined
}

let prisma: PrismaClient

// Check if DATABASE_URL is available
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.warn("DATABASE_URL is not set. Prisma client will not be able to connect to the database.")
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    datasources: databaseUrl ? {
      db: {
        url: databaseUrl,
      },
    } : undefined,
  })
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: ["query", "error", "warn"],
      datasources: databaseUrl ? {
        db: {
          url: databaseUrl,
        },
      } : undefined,
    })
  }
  prisma = global.__prisma
}

export { prisma }
