import { randomUUID } from 'node:crypto';
import type { CourseRepository, CourseData } from './course-repository';

export class InMemoryCourseRepository implements CourseRepository {
  public items: CourseData[] = [];

  async findById(id: string): Promise<CourseData | null> {
    return this.items.find((c) => c.id === id) ?? null;
  }

  async findAll(): Promise<CourseData[]> {
    return this.items.sort((a, b) => a.name.localeCompare(b.name));
  }

  async create(data: Omit<CourseData, 'id'>): Promise<CourseData> {
    const course: CourseData = { id: randomUUID(), ...data };
    this.items.push(course);
    return course;
  }

  async update(id: string, data: Partial<Omit<CourseData, 'id'>>): Promise<CourseData> {
    const index = this.items.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Course not found');
    this.items[index] = { ...this.items[index], ...data };
    return this.items[index];
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((c) => c.id !== id);
  }
}
