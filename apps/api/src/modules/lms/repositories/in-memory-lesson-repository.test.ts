import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryLessonRepository } from './in-memory-lesson-repository';

describe('InMemoryLessonRepository', () => {
  let repository: InMemoryLessonRepository;

  beforeEach(() => {
    repository = new InMemoryLessonRepository();
  });

  it('cria uma aula', async () => {
    const lesson = await repository.create({
      moduleId: 'module-1',
      title: 'Introdução ao TypeScript',
      type: 'VIDEO',
      contentUrl: 'https://youtube.com/watch?v=abc',
      orderIndex: 0,
    });

    expect(lesson.id).toBeDefined();
    expect(lesson.title).toBe('Introdução ao TypeScript');
  });

  it('lista aulas de um módulo ordenadas por orderIndex', async () => {
    await repository.create({
      moduleId: 'module-1',
      title: 'Aula 3',
      type: 'VIDEO',
      contentUrl: 'url-3',
      orderIndex: 2,
    });
    await repository.create({
      moduleId: 'module-1',
      title: 'Aula 1',
      type: 'VIDEO',
      contentUrl: 'url-1',
      orderIndex: 0,
    });
    await repository.create({
      moduleId: 'module-1',
      title: 'Aula 2',
      type: 'VIDEO',
      contentUrl: 'url-2',
      orderIndex: 1,
    });

    const lessons = await repository.findManyByModuleId('module-1');

    expect(lessons.map((l) => l.title)).toEqual(['Aula 1', 'Aula 2', 'Aula 3']);
  });

  it('não retorna aulas de outros módulos', async () => {
    await repository.create({
      moduleId: 'module-1',
      title: 'Aula do módulo 1',
      type: 'VIDEO',
      contentUrl: 'url',
      orderIndex: 0,
    });
    await repository.create({
      moduleId: 'module-2',
      title: 'Aula do módulo 2',
      type: 'VIDEO',
      contentUrl: 'url',
      orderIndex: 0,
    });

    const lessons = await repository.findManyByModuleId('module-1');

    expect(lessons).toHaveLength(1);
  });
});