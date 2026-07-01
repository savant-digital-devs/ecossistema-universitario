import { describe, it, expect, beforeEach } from 'vitest';
import { CreateCourseUseCase } from './create-course-use-case';
import { ListCoursesUseCase } from './list-courses-use-case';
import { UpdateCourseUseCase } from './update-course-use-case';
import { DeleteCourseUseCase } from './delete-course-use-case';
import { InMemoryCourseRepository } from '../../repositories/courses/in-memory-course-repository';

describe('Course Use Cases', () => {
  let courseRepository: InMemoryCourseRepository;
  let createUseCase: CreateCourseUseCase;
  let listUseCase: ListCoursesUseCase;
  let updateUseCase: UpdateCourseUseCase;
  let deleteUseCase: DeleteCourseUseCase;

  beforeEach(() => {
    courseRepository = new InMemoryCourseRepository();
    createUseCase = new CreateCourseUseCase(courseRepository);
    listUseCase = new ListCoursesUseCase(courseRepository);
    updateUseCase = new UpdateCourseUseCase(courseRepository);
    deleteUseCase = new DeleteCourseUseCase(courseRepository);
  });

  it('cria um curso', async () => {
    const course = await createUseCase.execute({
      name: 'Engenharia de Software',
      durationMonths: 48,
    });

    expect(course.id).toBeDefined();
    expect(course.name).toBe('Engenharia de Software');
    expect(course.description).toBeNull();
  });

  it('lista cursos em ordem alfabética', async () => {
    await createUseCase.execute({ name: 'Medicina', durationMonths: 72 });
    await createUseCase.execute({ name: 'Direito', durationMonths: 60 });
    await createUseCase.execute({ name: 'Arquitetura', durationMonths: 60 });

    const courses = await listUseCase.execute();

    expect(courses.map((c) => c.name)).toEqual(['Arquitetura', 'Direito', 'Medicina']);
  });

  it('atualiza um curso', async () => {
    const created = await createUseCase.execute({
      name: 'Engenharia',
      durationMonths: 48,
    });

    const updated = await updateUseCase.execute({
      id: created.id,
      name: 'Engenharia de Software',
      durationMonths: 60,
    });

    expect(updated.name).toBe('Engenharia de Software');
    expect(updated.durationMonths).toBe(60);
  });

  it('lança erro ao atualizar curso inexistente', async () => {
    await expect(updateUseCase.execute({ id: 'id-invalido', name: 'Novo nome' })).rejects.toThrow(
      'Curso não encontrado.',
    );
  });

  it('deleta um curso', async () => {
    const created = await createUseCase.execute({
      name: 'Engenharia',
      durationMonths: 48,
    });

    await deleteUseCase.execute({ id: created.id });

    const courses = await listUseCase.execute();
    expect(courses).toHaveLength(0);
  });

  it('lança erro ao deletar curso inexistente', async () => {
    await expect(deleteUseCase.execute({ id: 'id-invalido' })).rejects.toThrow(
      'Curso não encontrado.',
    );
  });
});
