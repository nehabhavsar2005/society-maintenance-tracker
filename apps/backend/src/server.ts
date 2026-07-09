import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './config/db';
import { startOverdueDetectionJob } from './jobs/overdue.job';

async function bootstrap() {
  try {
    await prisma.$connect();
    logger.info('[db] Connected to PostgreSQL database');
  } catch (error) {
    logger.error(`[db] Failed to connect to database: ${(error as Error).message}`);
  }

  startOverdueDetectionJob();

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Society Maintenance Tracker API running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection: ${reason}`);
  });
}

bootstrap();
