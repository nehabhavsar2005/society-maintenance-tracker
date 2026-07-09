import cron from 'node-cron';
import { complaintService } from '../modules/complaints/complaint.service';
import { logger } from '../config/logger';

export function startOverdueDetectionJob() {
  // Runs every hour, on the hour.
  cron.schedule('0 * * * *', async () => {
    try {
      const result = await complaintService.runOverdueDetection();
      if (result.markedOverdue > 0) {
        logger.info(`[overdue-job] Marked ${result.markedOverdue} complaint(s) as overdue`);
      }
    } catch (error) {
      logger.error(`[overdue-job] Failed: ${(error as Error).message}`);
    }
  });

  logger.info('[overdue-job] Scheduled overdue detection job (hourly)');
}
