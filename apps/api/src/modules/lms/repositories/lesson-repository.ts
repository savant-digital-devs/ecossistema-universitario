export interface LessonData {
  id: string;
  moduleId: string;
  title: string;
  type: 'VIDEO' | 'PDF' | 'TEXT';
  contentUrl: string;
  orderIndex: number;
}

export interface LessonRepository {
  findById(id: string): Promise<LessonData | null>;
  findManyByModuleId(moduleId: string): Promise<LessonData[]>;
  create(data: Omit<LessonData, 'id'>): Promise<LessonData>;
}
