import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { prisma } from '../config/db';
import { logger } from '../config/logger';

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    });
  }
  return transporter;
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  template: string;
  userId?: string;
}

export async function sendEmail({ to, subject, html, template, userId }: SendEmailOptions): Promise<void> {
  const canSend = Boolean(env.SMTP_HOST && env.SMTP_USER);

  if (!canSend) {
    logger.warn(`[email] SMTP not configured — skipping send to ${to} (${template})`);
    await prisma.emailLog.create({
      data: { userId, toEmail: to, subject, template, status: 'PENDING', error: 'SMTP not configured' },
    });
    return;
  }

  try {
    await getTransporter().sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    await prisma.emailLog.create({
      data: { userId, toEmail: to, subject, template, status: 'SENT' },
    });
  } catch (error) {
    logger.error(`[email] Failed to send email to ${to}: ${(error as Error).message}`);
    await prisma.emailLog.create({
      data: {
        userId,
        toEmail: to,
        subject,
        template,
        status: 'FAILED',
        error: (error as Error).message,
      },
    });
  }
}
