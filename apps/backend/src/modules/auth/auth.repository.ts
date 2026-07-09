import { prisma } from '../../config/db';

export const authRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  createResident(data: { name: string; email: string; password: string; phone?: string; flatNumber?: string; block?: string }) {
    return prisma.user.create({
      data: {
        ...data,
        role: 'RESIDENT',
      },
    });
  },

  setRefreshToken(userId: string, refreshToken: string | null) {
    return prisma.user.update({ where: { id: userId }, data: { refreshToken } });
  },

  setResetToken(userId: string, token: string | null, expires: Date | null) {
    return prisma.user.update({
      where: { id: userId },
      data: { passwordResetToken: token, passwordResetExpires: expires },
    });
  },

  findByResetToken(token: string) {
    return prisma.user.findFirst({
      where: { passwordResetToken: token, passwordResetExpires: { gt: new Date() } },
    });
  },

  updatePassword(userId: string, password: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { password, passwordResetToken: null, passwordResetExpires: null },
    });
  },
};
