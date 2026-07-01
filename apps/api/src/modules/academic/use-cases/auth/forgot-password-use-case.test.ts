import { describe, it, expect, beforeEach } from 'vitest';
import { ForgotPasswordUseCase } from './forgot-password-use-case';
import { RegisterUserUseCase } from './register-user-use-case';
import { InMemoryUserRepository } from '../../repositories/users/in-memory-user-repository';
import { FakeRedisClient } from '../../../../infra/cache/fake-redis-client';

describe('ForgotPasswordUseCase', () => {
  let userRepository: InMemoryUserRepository;
  let cache: FakeRedisClient;
  let sut: ForgotPasswordUseCase;
  let registerUseCase: RegisterUserUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    cache = new FakeRedisClient();
    sut = new ForgotPasswordUseCase(userRepository, cache);
    registerUseCase = new RegisterUserUseCase(userRepository);
  });

  it('armazena token no cache quando e-mail existe', async () => {
    await registerUseCase.execute({
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
      password: 'senha123',
      cpf: '12345678900',
    });

    await sut.execute({ email: 'maria@exemplo.com' });

    const keys = Array.from((cache as any).store.keys() as IterableIterator<string>);
    expect(keys.some((k) => k.startsWith('reset-password:'))).toBe(true);
  });

  it('não lança erro quando e-mail não existe', async () => {
    await expect(sut.execute({ email: 'naoexiste@exemplo.com' })).resolves.not.toThrow();
  });
});
