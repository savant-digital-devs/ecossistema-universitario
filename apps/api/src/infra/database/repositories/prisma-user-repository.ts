import { prisma } from '../prisma-client';
import type {
  UserRepository,
  UserData,
} from '../../../modules/academic/repositories/user-repository';

export class PrismaUserRepository implements UserRepository {
  async findById(id: string): Promise<UserData | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<UserData | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: Omit<UserData, 'id'>): Promise<UserData> {
    return prisma.user.create({ data });
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  }
}
