import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { homeExperienceData } from "./home-experience.data";

const prisma = new PrismaClient();

async function seedHome() {
  const existing = await prisma.section.findFirst({
    where: { pageId: "home", key: "home-experience" },
  });
  if (existing) {
    await prisma.section.update({
      where: { id: existing.id },
      data: homeExperienceData,
    });
    console.log("Home experience refreshed successfully.");
    return;
  }
  await prisma.section.create({ data: homeExperienceData });
  console.log("Home experience seeded successfully.");
}

seedHome().finally(() => prisma.$disconnect());
