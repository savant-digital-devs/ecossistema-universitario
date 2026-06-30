export interface SessionData {
  id: string;
  userId: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface SessionRepository {
  create(data: Omit<SessionData, 'id'>): Promise<SessionData>;
  findByRefreshToken(refreshToken: string): Promise<SessionData | null>;
  deleteByRefreshToken(refreshToken: string): Promise<void>;
  deleteAllByUserId(userId: string): Promise<void>;
}