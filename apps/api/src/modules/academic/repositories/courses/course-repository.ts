export interface CourseData {
  id: string;
  name: string;
  description: string | null;
  durationMonths: number;
}

export interface CourseRepository {
  findById(id: string): Promise<CourseData | null>;
  findAll(): Promise<CourseData[]>;
  create(data: Omit<CourseData, 'id'>): Promise<CourseData>;
  update(id: string, data: Partial<Omit<CourseData, 'id'>>): Promise<CourseData>;
  delete(id: string): Promise<void>;
}
