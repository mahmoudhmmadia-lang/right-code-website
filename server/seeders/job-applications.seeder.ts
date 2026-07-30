import { prisma } from "../utils/prisma";

const statuses = [
  "NEW",
  "REVIEWING",
  "SHORTLISTED",
  "INTERVIEW",
  "OFFERED",
  "HIRED",
  "REJECTED",
  "ARCHIVED",
];

const firstNames = [
  "Maya",
  "Omar",
  "Lina",
  "Kareem",
  "Nour",
  "Yousef",
  "Rana",
  "Tarek",
  "Sara",
  "Hassan",
  "Dalia",
  "Ali",
  "Mariam",
  "Fadi",
  "Leen",
  "Samir",
  "Hiba",
  "Bilal",
  "Aya",
  "Ziad",
];

const lastNames = [
  "Haddad",
  "Khalil",
  "Mansour",
  "Saleh",
  "Darwish",
  "Nasser",
  "Saad",
  "Farhat",
  "Amin",
  "Barakat",
];

const customTitles = [
  "QA Automation Engineer",
  "DevOps Engineer",
  "Data Analyst",
  "Mobile Developer",
  "UI Engineer",
];

const coverNotes = [
  "I enjoy building reliable products with clear user flows and maintainable implementation details.",
  "I have worked with cross-functional teams and can help ship polished client-facing features.",
  "My recent projects focused on performance, accessibility, and practical delivery under tight deadlines.",
  "I am interested in joining a team that values clean systems, strong communication, and measurable outcomes.",
  "I can contribute across discovery, implementation, and support for complex digital products.",
];

async function ensureJobTitles() {
  const existing = await prisma.jobTitle.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { key: "asc" }],
  });
  if (existing.length) return existing;

  const seededTitles = [
    { key: "frontend-engineer", title: "Frontend Engineer" },
    { key: "backend-engineer", title: "Backend Engineer" },
    { key: "fullstack-engineer", title: "Full-stack Engineer" },
    { key: "product-designer", title: "Product Designer" },
    { key: "project-manager", title: "Project Manager" },
  ];

  for (const [index, title] of seededTitles.entries()) {
    await prisma.jobTitle.upsert({
      where: { key: title.key },
      create: {
        key: title.key,
        sortOrder: (index + 1) * 10,
        isActive: true,
        translations: {
          en: { title: title.title },
          ar: { title: title.title },
          tr: { title: title.title },
        },
      },
      update: { isActive: true },
    });
  }

  return prisma.jobTitle.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { key: "asc" }],
  });
}

async function seedJobApplications() {
  const titles = await ensureJobTitles();
  await prisma.jobApplication.deleteMany({
    where: { email: { endsWith: "@applicant.test" } },
  });

  const now = Date.now();
  const cvUrl = "private-uploads/cv/1785402788753-108da9d0-b411-4769-96a0-9bbc51d65431.pdf";
  const applications = Array.from({ length: 50 }, (_, index) => {
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length];
    const title = titles[index % titles.length];
    const useCustomTitle = index % 7 === 0;
    const createdAt = new Date(now - index * 1000 * 60 * 60 * 9);

    return {
      fullName: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${index + 1}@applicant.test`,
      phone: `+963 9${String(30000000 + index * 17391).slice(0, 8)}`,
      jobTitleId: useCustomTitle ? null : title.id,
      customJobTitle: useCustomTitle ? customTitles[index % customTitles.length] : null,
      linkedInUrl: index % 3 === 0 ? `https://linkedin.com/in/test-applicant-${index + 1}` : null,
      portfolioUrl: index % 4 === 0 ? `https://portfolio.example.com/applicant-${index + 1}` : null,
      coverNote: coverNotes[index % coverNotes.length],
      cvUrl,
      status: statuses[index % statuses.length],
      internalNotes: index % 5 === 0 ? "Seeded test applicant for pagination and card layout review." : null,
      createdAt,
      updatedAt: createdAt,
    };
  });

  await prisma.jobApplication.createMany({ data: applications });
  console.log(`Seeded ${applications.length} test job applications.`);
}

seedJobApplications().finally(() => prisma.$disconnect());
