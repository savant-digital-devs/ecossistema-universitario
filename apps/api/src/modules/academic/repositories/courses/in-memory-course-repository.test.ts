import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryCourseRepository } from './in-memory-course-repository';

describe('InMemoryCourseRepository', () => {
  let repository: InMemoryCourseRepository;

  beforeEach(() => {
    repository = new InMemoryCourseRepository();
  });

  it('cria um curso', async () => {
    const course = await repository.create({
      name: 'Engenharia de Software',
      description: 'Curso focado em desenvolvimento',
      durationMonths: 48,
    });

    expect(course.id).toBeDefined();
    expect(course.name).toBe('Engenharia de Software');
  });

  it('encontra um curso pelo id', async () => {
    const created = await repository.create({
      name: 'Medicina',
      description: null,
      durationMonths: 72,
    });

    const found = await repository.findById(created.id);
    expect(found).toEqual(created);
  });

  it('lista cursos em ordem alfabética', async () => {
    await repository.create({ name: 'Medicina', description: null, durationMonths: 72 });
    await repository.create({ name: 'Direito', description: null, durationMonths: 60 });
    await repository.create({ name: 'Arquitetura', description: null, durationMonths: 60 });

    const courses = await repository.findAll();
    expect(courses.map((c) => c.name)).toEqual(['Arquitetura', 'Direito', 'Medicina']);
  });

  it('atualiza um curso', async () => {
    const created = await repository.create({
      name: 'Engenharia',
      description: null,
      durationMonths: 48,
    });

    const updated = await repository.update(created.id, { name: 'Engenharia de Software' });
    expect(updated.name).toBe('Engenharia de Software');
  });

  it('deleta um curso', async () => {
    const created = await repository.create({
      name: 'Engenharia',
      description: null,
      durationMonths: 48,
    });

    await repository.delete(created.id);

    const found = await repository.findById(created.id);
    expect(found).toBeNull();
  });

  it('retorna null quando curso não existe', async () => {
    const found = await repository.findById('id-inexistente');
    expect(found).toBeNull();
  });
});
