import { describe, it, expect, beforeEach } from 'vitest';
import { AuthenticateUserUseCase } from './authenticate-user-use-case';
import { RegisterUserUseCase } from './register-user-use-case';
import { InMemoryUserRepository } from '../repositories/users/in-memory-user-repository';
import { InMemorySessionRepository } from '../repositories/sessions/in-memory-session-repository';

describe('AuthenticateUserUseCase', () => {
  let userRepository: InMemoryUserRepository;
  let sessionRepository: InMemorySessionRepository;
  let sut: AuthenticateUserUseCase;
  let registerUseCase: RegisterUserUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sessionRepository = new InMemorySessionRepository();
    sut = new AuthenticateUserUseCase(userRepository, sessionRepository);
    registerUseCase = new RegisterUserUseCase(userRepository);
  });

  it('autentica com credenciais corretas', async () => {
    await registerUseCase.execute({
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
      password: 'senha123',
      cpf: '12345678900',
    });

    const result = await sut.execute({
      email: 'maria@exemplo.com',
      password: 'senha123',
    });

    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });

  it('persiste a sessão no banco após login', async () => {
    await registerUseCase.execute({
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
      password: 'senha123',
      cpf: '12345678900',
    });

    await sut.execute({
      email: 'maria@exemplo.com',
      password: 'senha123',
    });

    expect(sessionRepository.items).toHaveLength(1);
  });

  it('lança erro com e-mail inexistente', async () => {
    await expect(
      sut.execute({
        email: 'naoexiste@exemplo.com',
        password: 'senha123',
      }),
    ).rejects.toThrow('Usuário não encontrado.');
  });

  it('lança erro com senha incorreta', async () => {
    await registerUseCase.execute({
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
      password: 'senha123',
      cpf: '12345678900',
    });

    await expect(
      sut.execute({
        email: 'maria@exemplo.com',
        password: 'senha-errada',
      }),
    ).rejects.toThrow('Usuário não encontrado.');
  });
});
