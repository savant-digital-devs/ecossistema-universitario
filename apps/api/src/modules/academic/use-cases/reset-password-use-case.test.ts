import { describe, it, expect, beforeEach } from 'vitest';
import { ResetPasswordUseCase } from './reset-password-use-case';
import { RegisterUserUseCase } from './register-user-use-case';
import { ForgotPasswordUseCase } from './forgot-password-use-case';
import { InMemoryUserRepository } from '../repositories/in-memory-user-repository';
import { FakeRedisClient } from '../../../infra/cache/fake-redis-client';
import { compare } from 'bcryptjs';

describe('ResetPasswordUseCase', () => {
  let userRepository: InMemoryUserRepository;
  let cache: FakeRedisClient;
  let sut: ResetPasswordUseCase;
  let registerUseCase: RegisterUserUseCase;
  let forgotPasswordUseCase: ForgotPasswordUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    cache = new FakeRedisClient();
    sut = new ResetPasswordUseCase(userRepository, cache);
    registerUseCase = new RegisterUserUseCase(userRepository);
    forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, cache);
  });

  it('redefine a senha com token válido', async () => {
    await registerUseCase.execute({
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
      password: 'senha123',
      cpf: '12345678900',
    });

    await forgotPasswordUseCase.execute({ email: 'maria@exemplo.com' });

    const token = Array.from((cache as any).store.keys() as IterableIterator<string>)[0].replace('reset-password:', '');

    await sut.execute({ token, newPassword: 'novasenha456' });

    const user = userRepository.items[0];
    const passwordUpdated = await compare('novasenha456', user.passwordHash);
    expect(passwordUpdated).toBe(true);
  });

  it('invalida o token após uso', async () => {
    await registerUseCase.execute({
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
      password: 'senha123',
      cpf: '12345678900',
    });

    await forgotPasswordUseCase.execute({ email: 'maria@exemplo.com' });

    const token = Array.from((cache as any).store.keys() as IterableIterator<string>)[0].replace('reset-password:', '');

    await sut.execute({ token, newPassword: 'novasenha456' });

    await expect(
      sut.execute({ token, newPassword: 'outrasenha' }),
    ).rejects.toThrow('Token não encontrado.');
  });

  it('lança erro com token inválido', async () => {
    await expect(
      sut.execute({ token: 'token-invalido', newPassword: 'novasenha' }),
    ).rejects.toThrow('Token não encontrado.');
  });
});