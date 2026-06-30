import type { SessionRepository, SessionData } from './session-repository';
import { randomUUID } from 'node:crypto';

export class InMemorySessionRepository implements SessionRepository {
  public items: SessionData[] = [];

  async create(data: Omit<SessionData, 'id'>): Promise<SessionData> {
    const session: SessionData = { id: randomUUID(), ...data };
    this.items.push(session);
    return session;
  }

  async findByRefreshToken(refreshToken: string): Promise<SessionData | null> {
    return this.items.find((s) => s.refreshToken === refreshToken) ?? null;
  }

  async deleteByRefreshToken(refreshToken: string): Promise<void> {
    this.items = this.items.filter((s) => s.refreshToken !== refreshToken);
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    this.items = this.items.filter((s) => s.userId !== userId);
  }
}
