import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { env } from '../../../infra/config/env';
import type { UserRepository } from '../repositories/users/user-repository';
import type { SessionRepository } from '../repositories/sessions/session-repository';
import { ResourceNotFoundError } from '../../../core/errors/resource-not-found-error';

interface RefreshTokenRequest {
  refreshToken: string;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute({ refreshToken }: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const session = await this.sessionRepository.findByRefreshToken(refreshToken);

    if (!session) {
      throw new ResourceNotFoundError('Sessão');
    }

    if (session.expiresAt < new Date()) {
      await this.sessionRepository.deleteByRefreshToken(refreshToken);
      throw new ResourceNotFoundError('Sessão');
    }

    const user = await this.userRepository.findById(session.userId);

    if (!user) {
      throw new ResourceNotFoundError('Usuário');
    }

    await this.sessionRepository.deleteByRefreshToken(refreshToken);

    const newRefreshToken = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.sessionRepository.create({
      userId: user.id,
      refreshToken: newRefreshToken,
      expiresAt,
    });

    const accessToken = jwt.sign({ role: user.role }, env.JWT_SECRET, {
      subject: user.id,
      expiresIn: env.JWT_EXPIRES_IN as '15m',
    });

    return { accessToken, refreshToken: newRefreshToken };
  }
}
