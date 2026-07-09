import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/ApiResponse';
import { authService } from './auth.service';
import { ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from './auth.dto';
import { isProd } from '../../config/env';
import { ApiError } from '../../utils/ApiError';

const REFRESH_COOKIE = 'refreshToken';

const cookieOptions = (rememberMe = false) => ({
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000,
  path: '/',
});

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const dto = req.body as RegisterDto;
    const { user, accessToken, refreshToken } = await authService.register(dto);
    res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions(false));
    sendSuccess(res, { user, accessToken }, 'Registration successful', 201);
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const dto = req.body as LoginDto;
    const { user, accessToken, refreshToken } = await authService.login(dto);
    res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions(dto.rememberMe));
    sendSuccess(res, { user, accessToken }, 'Login successful');
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const tokenFromCookie = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    const tokenFromBody = (req.body as { refreshToken?: string })?.refreshToken;
    const { user, accessToken, refreshToken } = await authService.refresh(tokenFromCookie ?? tokenFromBody);
    res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions(false));
    sendSuccess(res, { user, accessToken }, 'Session refreshed');
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    if (req.user) {
      await authService.logout(req.user.id);
    }
    res.clearCookie(REFRESH_COOKIE, { path: '/' });
    sendSuccess(res, null, 'Logged out successfully');
  }),

  forgotPassword: asyncHandler(async (req: Request, res: Response) => {
    const dto = req.body as ForgotPasswordDto;
    await authService.forgotPassword(dto.email);
    sendSuccess(res, null, 'If an account exists for this email, a reset link has been sent.');
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    const dto = req.body as ResetPasswordDto;
    await authService.resetPassword(dto.token, dto.password);
    sendSuccess(res, null, 'Password has been reset successfully. You can now log in.');
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const user = await authService.getProfile(req.user.id);
    sendSuccess(res, user, 'Profile fetched');
  }),
};
