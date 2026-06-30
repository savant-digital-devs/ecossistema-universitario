import type { UserRepository, UserData } from './user-repository';
import { randomUUID } from 'node:crypto';

export class InMemoryUserRepository implements UserRepository {
  public items: UserData[] = [];

  async findById(id: string): Promise<UserData | null> {
    return this.items.find((user) => user.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<UserData | null> {
    return this.items.find((user) => user.email === email) ?? null;
  }

  async create(data: Omit<UserData, 'id' | 'role'>): Promise<UserData> {
    const user: UserData = { id: randomUUID(), role: 'STUDENT', ...data };
    this.items.push(user);
    return user;
  }
}