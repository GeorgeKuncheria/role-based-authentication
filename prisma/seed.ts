import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { hashPassword } from "@/app/lib/auth";
import * as dotenv from "dotenv";

dotenv.config();

// 1. Connection Setup (Prisma 7 Style)
const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter: adapter });



async function main() {
    console.log("Starting database seed...");

    // Clear existing data to prevent unique constraint errors on re-run
    await prisma.user.deleteMany();
    await prisma.team.deleteMany();

    // 2. Create Teams (Based on Screenshots 1, 2, & 3)
    console.log("Creating teams...");
    const teams = await Promise.all([
        prisma.team.create({
            data: {
                name: "Engineering",
                description: "Software development team",
                code: "ENG-2024",
            },
        }),
        prisma.team.create({
            data: {
                name: "Marketing",
                description: "Marketing and sales team",
                code: "MKT-2024",
            },
        }),
        prisma.team.create({
            data: {
                name: "Operations",
                description: "Business operations team",
                code: "OPS-2024",
            },
        }),
    ]);

    // 3. Define Sample Users (Based on Screenshots 4, 5, & 6)
    const sampleUsers = [
        {
            name: "John Developer",
            email: "john@company.com",
            teamId: teams[0].id, // Links to Engineering
            role: Role.MANAGER,
        },
        {
            name: "Jane Designer",
            email: "jane@company.com",
            teamId: teams[0].id, // Links to Engineering
            role: Role.USER,
        },
        {
            name: "Bob Marketer",
            email: "bob@company.com",
            teamId: teams[1].id, // Links to Marketing
            role: Role.MANAGER,
        },
        {
            name: "Alice Sales",
            email: "alice@company.com",
            teamId: teams[1].id, // Links to Marketing
            role: Role.USER,
        },
    ];

    // 4. Create Users (Based on Screenshot 7)
    console.log("Creating users...");
    const commonPassword = await hashPassword("123456");

    for (const userData of sampleUsers) {
        await prisma.user.create({
            data: {
                email: userData.email,
                name: userData.name,
                password: commonPassword,
                role: userData.role,
                teamId: userData.teamId,
            },
        });
    }

    console.log("✅ Database seeded successfully!");
}

main()
    .catch((e) => {
        console.error("Seeding error: ", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end(); // Clean up the pg pool
    });