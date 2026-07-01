import type { CourseRepository } from '../../repositories/courses/course-repository';
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error';

interface UpdateCourseRequest {
  id: string;
  name?: string;
  description?: string;
  durationMonths?: number;
}

export class UpdateCourseUseCase {
  constructor(private readonly courseRepository: CourseRepository) {}

  async execute({ id, ...data }: UpdateCourseRequest) {
    const course = await this.courseRepository.findById(id);

    if (!course) {
      throw new ResourceNotFoundError('Curso');
    }

    return this.courseRepository.update(id, data);
  }
}
