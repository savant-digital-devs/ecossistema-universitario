import type { CourseRepository } from '../../repositories/courses/course-repository';
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error';

interface DeleteCourseRequest {
  id: string;
}

export class DeleteCourseUseCase {
  constructor(private readonly courseRepository: CourseRepository) {}

  async execute({ id }: DeleteCourseRequest): Promise<void> {
    const course = await this.courseRepository.findById(id);

    if (!course) {
      throw new ResourceNotFoundError('Curso');
    }

    await this.courseRepository.delete(id);
  }
}
