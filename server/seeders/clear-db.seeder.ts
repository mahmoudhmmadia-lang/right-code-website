import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDatabase() {
  await prisma.jobApplication.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.jobTitle.deleteMany();
  await prisma.trainingProgram.deleteMany();
  await prisma.post.deleteMany();
  await prisma.project.deleteMany();
  await prisma.service.deleteMany();
  await prisma.section.deleteMany();
  await prisma.page.deleteMany();
  await prisma.account.deleteMany();

  console.log("Database cleared.");
}

clearDatabase().finally(() => prisma.$disconnect());
