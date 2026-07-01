import { describe, it, expect, beforeEach } from 'vitest';
import { InMemorySessionRepository } from './in-memory-session-repository';

describe('InMemorySessionRepository', () => {
  let repository: InMemorySessionRepository;

  beforeEach(() => {
    repository = new InMemorySessionRepository();
  });

  it('cria uma sessão', async () => {
    const session = await repository.create({
      userId: 'user-1',
      refreshToken: 'token-abc',
      expiresAt: new Date('2026-12-31'),
    });

    expect(session.id).toBeDefined();
    expect(session.refreshToken).toBe('token-abc');
  });

  it('encontra sessão pelo refresh token', async () => {
    await repository.create({
      userId: 'user-1',
      refreshToken: 'token-abc',
      expiresAt: new Date('2026-12-31'),
    });

    const found = await repository.findByRefreshToken('token-abc');
    expect(found?.userId).toBe('user-1');
  });

  it('deleta sessão pelo refresh token', async () => {
    await repository.create({
      userId: 'user-1',
      refreshToken: 'token-abc',
      expiresAt: new Date('2026-12-31'),
    });

    await repository.deleteByRefreshToken('token-abc');

    const found = await repository.findByRefreshToken('token-abc');
    expect(found).toBeNull();
  });

  it('deleta todas as sessões de um usuário', async () => {
    await repository.create({
      userId: 'user-1',
      refreshToken: 'token-1',
      expiresAt: new Date('2026-12-31'),
    });
    await repository.create({
      userId: 'user-1',
      refreshToken: 'token-2',
      expiresAt: new Date('2026-12-31'),
    });

    await repository.deleteAllByUserId('user-1');

    expect(repository.items).toHaveLength(0);
  });
});
