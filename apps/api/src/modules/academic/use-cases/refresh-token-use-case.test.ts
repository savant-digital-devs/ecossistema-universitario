import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RefreshTokenUseCase } from './refresh-token-use-case';
import { RegisterUserUseCase } from './register-user-use-case';
import { AuthenticateUserUseCase } from './authenticate-user-use-case';
import { InMemoryUserRepository } from '../repositories/in-memory-user-repository';
import { InMemorySessionRepository } from '../repositories/in-memory-session-repository';

describe('RefreshTokenUseCase', () => {
  let userRepository: InMemoryUserRepository;
  let sessionRepository: InMemorySessionRepository;
  let sut: RefreshTokenUseCase;
  let registerUseCase: RegisterUserUseCase;
  let authenticateUseCase: AuthenticateUserUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sessionRepository = new InMemorySessionRepository();
    sut = new RefreshTokenUseCase(userRepository, sessionRepository);
    registerUseCase = new RegisterUserUseCase(userRepository);
    authenticateUseCase = new AuthenticateUserUseCase(userRepository, sessionRepository);
  });

  it('gera um novo par de tokens com refresh token válido', async () => {
    await registerUseCase.execute({
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
      password: 'senha123',
      cpf: '12345678900',
    });

    const { refreshToken } = await authenticateUseCase.execute({
      email: 'maria@exemplo.com',
      password: 'senha123',
    });

    const result = await sut.execute({ refreshToken });

    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
    expect(result.refreshToken).not.toBe(refreshToken);
  });

  it('invalida o refresh token antigo após renovação', async () => {
    await registerUseCase.execute({
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
      password: 'senha123',
      cpf: '12345678900',
    });

    const { refreshToken } = await authenticateUseCase.execute({
      email: 'maria@exemplo.com',
      password: 'senha123',
    });

    await sut.execute({ refreshToken });

    await expect(sut.execute({ refreshToken })).rejects.toThrow('Sessão não encontrado.');
  });

  it('lança erro com refresh token inexistente', async () => {
    await expect(sut.execute({ refreshToken: 'token-invalido' })).rejects.toThrow(
      'Sessão não encontrado.',
    );
  });

  it('lança erro com refresh token expirado', async () => {
    await registerUseCase.execute({
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
      password: 'senha123',
      cpf: '12345678900',
    });

    const { refreshToken } = await authenticateUseCase.execute({
      email: 'maria@exemplo.com',
      password: 'senha123',
    });

    sessionRepository.items[0].expiresAt = new Date('2020-01-01');

    await expect(sut.execute({ refreshToken })).rejects.toThrow('Sessão não encontrado.');
  });
});
