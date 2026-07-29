import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { aboutPage } from "./pages/about.page";
import { blogPage } from "./pages/blog.page";
import { contactPage } from "./pages/contact.page";
import { createProjectPage } from "./pages/create-project.page";
import { homePage } from "./pages/home.page";
import { servicesPage } from "./pages/services.page";
import { teamPage } from "./pages/team.page";
import { workPage } from "./pages/work.page";

const prisma = new PrismaClient();
const routePages = [homePage, servicesPage, workPage, aboutPage, teamPage, blogPage, createProjectPage, contactPage];

async function seedPages() {
  for (const page of routePages) {
    const existing = await prisma.page.findUnique({ where: { slug: page.slug } });
    if (!existing) {
      await prisma.page.create({ data: page });
      continue;
    }

    const current = (existing.translations ?? {}) as Record<string, Record<string, unknown>>;
    const translations = Object.fromEntries(
      Object.entries(page.translations).map(([locale, defaults]) => [
        locale,
        { ...defaults, ...(current[locale] ?? {}) },
      ]),
    );
    if (JSON.stringify(translations) !== JSON.stringify(current)) {
      await prisma.page.update({ where: { id: existing.id }, data: { translations } });
    }
  }
  console.log("Route pages checked; missing pages and translation fields were seeded without replacing CMS edits.");
}

seedPages().finally(() => prisma.$disconnect());
