import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { ApiError } from '../../utils/ApiError';
import { authRepository } from './auth.repository';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../services/token.service';
import { sendEmail } from '../../services/email.service';
import { passwordResetTemplate } from '../../templates/emailTemplates';
import { env } from '../../config/env';
import { LoginDto, RegisterDto } from './auth.dto';
import { logger } from '../../config/logger';

const SALT_ROUNDS = 12;

function sanitizeUser<T extends { password: string; refreshToken?: string | null; passwordResetToken?: string | null; passwordResetExpires?: Date | null }>(
  user: T
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, refreshToken: _refreshToken, passwordResetToken: _passwordResetToken, passwordResetExpires: _passwordResetExpires, ...safe } = user;
  return safe;
}

export const authService = {
  async register(dto: RegisterDto) {
    const existing = await authRepository.findByEmail(dto.email);
    if (existing) {
      throw ApiError.conflict('An account with this email already exists');
    }

    const hashed = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await authRepository.createResident({ ...dto, password: hashed });

    return this.issueTokens(user, false);
  },

  async login(dto: LoginDto) {
    const user = await authRepository.findByEmail(dto.email);
    if (!user || !user.isActive) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    return this.issueTokens(user, dto.rememberMe ?? false);
  },

  async issueTokens(
    user: Awaited<ReturnType<typeof authRepository.findByEmail>>,
    rememberMe: boolean
  ) {
    if (!user) throw ApiError.internal();

    const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload, rememberMe);

    await authRepository.setRefreshToken(user.id, refreshToken);

    return { user: sanitizeUser(user), accessToken, refreshToken };
  },

  async refresh(incomingToken: string | undefined) {
    if (!incomingToken) {
      throw ApiError.unauthorized('Refresh token missing');
    }

    let payload;
    try {
      payload = verifyRefreshToken(incomingToken);
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const user = await authRepository.findById(payload.id);
    if (!user || user.refreshToken !== incomingToken) {
      throw ApiError.unauthorized('Refresh token has been revoked');
    }

    return this.issueTokens(user, false);
  },

  async logout(userId: string) {
    await authRepository.setRefreshToken(userId, null);
  },

  async forgotPassword(email: string) {
    const user = await authRepository.findByEmail(email);
    // Do not reveal whether the email exists — always resolve successfully.
    if (!user) return;

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await authRepository.setResetToken(user.id, token, expires);

    const resetUrl = `${env.CLIENT_URL}/reset-password?token=${token}`;

    await sendEmail({
      to: user.email,
      subject: 'Reset your Society Maintenance Tracker password',
      html: passwordResetTemplate(user.name, resetUrl),
      template: 'password-reset',
      userId: user.id,
    }).catch((error) => logger.error(`Failed to send password reset email: ${error}`));
  },

  async resetPassword(token: string, newPassword: string) {
    const user = await authRepository.findByResetToken(token);
    if (!user) {
      throw ApiError.badRequest('Reset token is invalid or has expired');
    }

    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await authRepository.updatePassword(user.id, hashed);
    await authRepository.setRefreshToken(user.id, null);
  },

  async getProfile(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) throw ApiError.notFound('User not found');
    return sanitizeUser(user);
  },
};
