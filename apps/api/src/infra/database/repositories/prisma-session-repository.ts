import { prisma } from '../prisma-client';
import type {
  SessionRepository,
  SessionData,
} from '../../../modules/academic/repositories/session-repository';

export class PrismaSessionRepository implements SessionRepository {
  async create(data: Omit<SessionData, 'id'>): Promise<SessionData> {
    return prisma.session.create({ data });
  }

  async findByRefreshToken(refreshToken: string): Promise<SessionData | null> {
    return prisma.session.findUnique({ where: { refreshToken } });
  }

  async deleteByRefreshToken(refreshToken: string): Promise<void> {
    await prisma.session.delete({ where: { refreshToken } });
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await prisma.session.deleteMany({ where: { userId } });
  }
}
