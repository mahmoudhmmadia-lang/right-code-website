import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { routeSections } from "./route-sections.data";
import { projectWizardData } from "./project-wizard.data";

const prisma = new PrismaClient();

export async function seedRouteSections() {
  for (const section of routeSections) {
    const existing = await prisma.section.findFirst({
      where: { pageId: section.pageId, key: section.key },
    });

    if (existing) {
      await prisma.section.update({ where: { id: existing.id }, data: section });
    } else {
      await prisma.section.create({ data: section });
    }
  }

  const wizard = await prisma.section.findFirst({
    where: { pageId: projectWizardData.pageId, key: projectWizardData.key },
  });
  if (wizard) await prisma.section.update({ where: { id: wizard.id }, data: projectWizardData });
  else await prisma.section.create({ data: projectWizardData });

  console.log("Route sections seeded.");
}

seedRouteSections().finally(() => prisma.$disconnect());
