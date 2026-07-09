import dotenv from 'dotenv';

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    // eslint-disable-next-line no-console
    console.warn(`[env] Missing environment variable: ${name}`);
    return '';
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 5000),

  DATABASE_URL: required('DATABASE_URL'),

  JWT_ACCESS_SECRET: required('JWT_ACCESS_SECRET', 'dev-access-secret-change-me'),
  JWT_REFRESH_SECRET: required('JWT_REFRESH_SECRET', 'dev-refresh-secret-change-me'),
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  JWT_REFRESH_EXPIRES_IN_REMEMBER: process.env.JWT_REFRESH_EXPIRES_IN_REMEMBER ?? '30d',

  CLIENT_URL: process.env.CLIENT_URL ?? 'http://localhost:3000',

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ?? '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ?? '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ?? '',

  SMTP_HOST: process.env.SMTP_HOST ?? '',
  SMTP_PORT: Number(process.env.SMTP_PORT ?? 587),
  SMTP_USER: process.env.SMTP_USER ?? '',
  SMTP_PASS: process.env.SMTP_PASS ?? '',
  EMAIL_FROM: process.env.EMAIL_FROM ?? 'Society Tracker <no-reply@societytracker.com>',

  RESEND_API_KEY: process.env.RESEND_API_KEY ?? '',
  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER ?? 'nodemailer', // 'nodemailer' | 'resend'

  DEFAULT_OVERDUE_DAYS: Number(process.env.DEFAULT_OVERDUE_DAYS ?? 7),
} as const;

export const isProd = env.NODE_ENV === 'production';
