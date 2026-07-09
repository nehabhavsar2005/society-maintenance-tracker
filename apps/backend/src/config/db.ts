import { PrismaClient } from '@prisma/client';
import { isProd } from './env';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isProd ? ['error', 'warn'] : ['error', 'warn'],
  });

if (!isProd) {
  globalForPrisma.prisma = prisma;
}
