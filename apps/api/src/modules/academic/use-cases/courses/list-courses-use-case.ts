import type { CourseRepository } from '../../repositories/courses/course-repository';

export class ListCoursesUseCase {
  constructor(private readonly courseRepository: CourseRepository) {}

  async execute() {
    return this.courseRepository.findAll();
  }
}
