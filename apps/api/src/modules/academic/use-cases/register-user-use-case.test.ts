import { describe, it, expect, beforeEach } from 'vitest';
import { RegisterUserUseCase } from './register-user-use-case';
import { InMemoryUserRepository } from '../repositories/users/in-memory-user-repository';

describe('RegisterUserUseCase', () => {
  let userRepository: InMemoryUserRepository;
  let sut: RegisterUserUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new RegisterUserUseCase(userRepository);
  });

  it('registra um novo usuário com sucesso', async () => {
    const result = await sut.execute({
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
      password: 'senha123',
      cpf: '12345678900',
    });

    expect(result.id).toBeDefined();
    expect(result.email).toBe('maria@exemplo.com');
  });

  it('não retorna passwordHash na resposta', async () => {
    const result = await sut.execute({
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
      password: 'senha123',
      cpf: '12345678900',
    });

    expect(result).not.toHaveProperty('passwordHash');
  });

  it('lança erro quando e-mail já está cadastrado', async () => {
    await sut.execute({
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
      password: 'senha123',
      cpf: '12345678900',
    });

    await expect(
      sut.execute({
        name: 'Maria Silva 2',
        email: 'maria@exemplo.com',
        password: 'outrasenha',
        cpf: '99988877766',
      }),
    ).rejects.toThrow('E-mail já cadastrado.');
  });

  it('faz hash da senha antes de salvar', async () => {
    await sut.execute({
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
      password: 'senha123',
      cpf: '12345678900',
    });

    const savedUser = userRepository.items[0];
    expect(savedUser.passwordHash).not.toBe('senha123');
  });
});
