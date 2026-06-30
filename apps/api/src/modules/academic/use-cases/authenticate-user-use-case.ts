import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { env } from '../../../infra/config/env';
import type { UserRepository } from '../repositories/user-repository';
import type { SessionRepository } from '../repositories/session-repository';
import { ResourceNotFoundError } from '../../../core/errors/resource-not-found-error';

interface AuthenticateUserRequest {
  email: string;
  password: string;
}

interface AuthenticateUserResponse {
  accessToken: string;
  refreshToken: string;
}

export class AuthenticateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new ResourceNotFoundError('Usuário');
    }

    const passwordMatch = await compare(password, user.passwordHash);

    if (!passwordMatch) {
      throw new ResourceNotFoundError('Usuário');
    }

    const accessToken = sign({ role: user.role }, env.JWT_SECRET, {
      subject: user.id,
      expiresIn: env.JWT_EXPIRES_IN as '15m',
    });

    const refreshToken = randomUUID();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.sessionRepository.create({
      userId: user.id,
      refreshToken,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }
}