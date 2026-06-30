import type { LessonRepository, LessonData } from './lesson-repository';
import { randomUUID } from 'node:crypto';

export class InMemoryLessonRepository implements LessonRepository {
  public items: LessonData[] = [];

  async findById(id: string): Promise<LessonData | null> {
    return this.items.find((lesson) => lesson.id === id) ?? null;
  }

  async findManyByModuleId(moduleId: string): Promise<LessonData[]> {
    return this.items
      .filter((lesson) => lesson.moduleId === moduleId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async create(data: Omit<LessonData, 'id'>): Promise<LessonData> {
    const lesson: LessonData = { id: randomUUID(), ...data };
    this.items.push(lesson);
    return lesson;
  }
}