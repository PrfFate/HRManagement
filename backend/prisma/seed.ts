import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

import { RoleIds, RoleNames } from "../src/common/constants/roles.js";

const prisma = new PrismaClient();

async function main() {
  await prisma.role.upsert({
    where: { id: RoleIds.Manager },
    update: { name: RoleNames.Manager },
    create: { id: RoleIds.Manager, name: RoleNames.Manager },
  });

  await prisma.role.upsert({
    where: { id: RoleIds.Employee },
    update: { name: RoleNames.Employee },
    create: { id: RoleIds.Employee, name: RoleNames.Employee },
  });

  await prisma.role.upsert({
    where: { id: RoleIds.PendingUser },
    update: { name: RoleNames.PendingUser },
    create: { id: RoleIds.PendingUser, name: RoleNames.PendingUser },
  });

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminFullName = process.env.ADMIN_FULL_NAME ?? "Admin User";

  if (!adminEmail || !adminPassword) {
    console.log("Admin seed skipped.");
    return;
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
      data: {
        fullName: adminFullName,
        email: adminEmail,
        passwordHash,
        roleId: RoleIds.Manager,
        isActive: true,
        approvalStatus: "APPROVED",
      },
    });

    console.log("Admin user created.");
  } else {
    console.log("Admin user already exists.");
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
