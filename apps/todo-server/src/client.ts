import { PrismaClient } from '@prisma/client';
// import config from './config/config';

// Singleton instance
let prisma;

if (!prisma) {
  prisma = new PrismaClient();

  // if (config.env === 'development') {
  prisma.$on('beforeExit', async () => {
    // Disconnect when the Node.js process exits
    await prisma.$disconnect();
  });
  // }
}

export default prisma;
