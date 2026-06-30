import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryUserRepository } from './in-memory-user-repository';
import { compare } from 'bcryptjs';
import { hash } from 'bcryptjs';

describe('InMemoryUserRepository', () => {
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
  });

  it('cria um usuário e gera um id automaticamente com role padrão STUDENT', async () => {
    const user = await repository.create({
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
      passwordHash: 'hash-qualquer',
      cpf: '12345678900',
    });

    expect(user.id).toBeDefined();
    expect(user.name).toBe('Maria Silva');
    expect(user.role).toBe('STUDENT');
  });

  it('encontra um usuário pelo id', async () => {
    const created = await repository.create({
      name: 'João Souza',
      email: 'joao@exemplo.com',
      passwordHash: 'hash-qualquer',
      cpf: '98765432100',
    });

    const found = await repository.findById(created.id);

    expect(found).toEqual(created);
  });

  it('encontra um usuário pelo email', async () => {
    await repository.create({
      name: 'Ana Lima',
      email: 'ana@exemplo.com',
      passwordHash: 'hash-qualquer',
      cpf: '11122233344',
    });

    const found = await repository.findByEmail('ana@exemplo.com');

    expect(found?.name).toBe('Ana Lima');
  });

  it('retorna null quando o usuário não existe', async () => {
    const found = await repository.findById('id-que-nao-existe');

    expect(found).toBeNull();
  });

  it('atualiza a senha do usuário', async () => {
    const created = await repository.create({
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
      passwordHash: await hash('senha-antiga', 8),
      cpf: '12345678900',
    });

    const novoHash = await hash('nova-senha', 8);
    await repository.updatePassword(created.id, novoHash);

    const updated = repository.items.find((u) => u.id === created.id);
    const senhaCorreta = await compare('nova-senha', updated!.passwordHash);
    expect(senhaCorreta).toBe(true);
  });
});