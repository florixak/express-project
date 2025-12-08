import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

let prismaInstance;
let pool;

const connectDB = async () => {
  try {
    if (!pool) {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });

      const adapter = new PrismaPg(pool);
      prismaInstance = new PrismaClient({ adapter });
    }

    await prismaInstance.$connect();
    console.log("DB Connected via Prisma");
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  if (prismaInstance) await prismaInstance.$disconnect();
  if (pool) await pool.end();
};

const getPrisma = () => {
  if (!prismaInstance) {
    throw new Error("Prisma not initialized. Call connectDB() first.");
  }
  return prismaInstance;
};

export { getPrisma, connectDB, disconnectDB };
