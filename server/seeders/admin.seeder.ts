import { prisma } from "@/utils/prisma";
import { hash } from "bcryptjs";
import { config } from "dotenv";

config();
async function seedAdmin() {
  await prisma.account.deleteMany({
    where: {
      role: 0,
    },
  });
  const existingAdmin = await prisma.account.findFirst({
    where: {
      role: 0,
    },
  });

  if (!existingAdmin) {
    const hashed = await hash(process.env.ADMIN_PASSWORD ?? "rightcode@M", 10);
    await prisma.account.create({
      data: {
        email: process.env.ADMIN_EMAIL ?? "admin@rightcode.io",
        fullName: process.env.ADMIN_NAME ?? "Right Code Admin",
        password: hashed,
        role: 0,
      },
    });
  }
}

seedAdmin().finally(() => prisma.$disconnect());
