
import {prisma} from "@/lib/prisma";

// Database helper functions
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    // This pings the database to ensure the adapter is working
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error(`Database connection error: ${error}`);
    return false;
  }
}