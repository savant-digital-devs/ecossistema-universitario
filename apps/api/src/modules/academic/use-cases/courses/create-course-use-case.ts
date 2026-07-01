import type { CourseRepository } from '../../repositories/courses/course-repository';

interface CreateCourseRequest {
  name: string;
  description?: string;
  durationMonths: number;
}

export class CreateCourseUseCase {
  constructor(private readonly courseRepository: CourseRepository) {}

  async execute({ name, description, durationMonths }: CreateCourseRequest) {
    const course = await this.courseRepository.create({
      name,
      description: description ?? null,
      durationMonths,
    });

    return course;
  }
}
