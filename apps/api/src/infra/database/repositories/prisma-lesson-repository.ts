import { prisma } from '../prisma-client';
import type { LessonRepository, LessonData } from '../../../modules/lms/repositories/lesson-repository';

export class PrismaLessonRepository implements LessonRepository {
  async findById(id: string): Promise<LessonData | null> {
    return prisma.lesson.findUnique({ where: { id } });
  }

  async findManyByModuleId(moduleId: string): Promise<LessonData[]> {
    return prisma.lesson.findMany({
      where: { moduleId },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async create(data: Omit<LessonData, 'id'>): Promise<LessonData> {
    return prisma.lesson.create({ data });
  }
}