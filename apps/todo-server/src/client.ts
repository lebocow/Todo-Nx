import { PrismaClient } from '@prisma/client';

// Singleton instance
let prisma: PrismaClient;

if (!prisma) {
  prisma = new PrismaClient();

  process.on('SIGTERM', async () => await prisma.$disconnect());
}

export default prisma;
