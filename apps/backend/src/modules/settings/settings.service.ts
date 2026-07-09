import { ComplaintPriority } from '@prisma/client';
import { prisma } from '../../config/db';
import { env } from '../../config/env';

const DEFAULT_THRESHOLDS: Record<ComplaintPriority, number> = {
  HIGH: 3,
  MEDIUM: 7,
  LOW: 15,
};

export const settingsService = {
  async getPrioritySettings() {
    const existing = await prisma.prioritySettings.findMany();
    if (existing.length === 3) return existing;

    // Self-heal: seed defaults if not present (idempotent upsert)
    const priorities: ComplaintPriority[] = ['LOW', 'MEDIUM', 'HIGH'];
    await Promise.all(
      priorities.map((priority) =>
        prisma.prioritySettings.upsert({
          where: { priority },
          update: {},
          create: { priority, overdueThresholdDays: DEFAULT_THRESHOLDS[priority] },
        })
      )
    );
    return prisma.prioritySettings.findMany();
  },

  async updatePrioritySettings(priority: ComplaintPriority, overdueThresholdDays: number) {
    return prisma.prioritySettings.upsert({
      where: { priority },
      update: { overdueThresholdDays },
      create: { priority, overdueThresholdDays },
    });
  },

  async getThresholdDaysFor(priority: ComplaintPriority): Promise<number> {
    const settings = await this.getPrioritySettings();
    const match = settings.find((s) => s.priority === priority);
    return match?.overdueThresholdDays ?? env.DEFAULT_OVERDUE_DAYS ?? DEFAULT_THRESHOLDS[priority];
  },

  async getSystemSettings() {
    return prisma.systemSetting.findMany();
  },

  async getSystemSetting(key: string, fallback = '') {
    const setting = await prisma.systemSetting.findUnique({ where: { key } });
    return setting?.value ?? fallback;
  },

  async setSystemSetting(key: string, value: string) {
    return prisma.systemSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
  },
};
