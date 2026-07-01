import { randomUUID } from 'node:crypto';
import { emailQueue } from '../../../../infra/queue/queues';
import type { UserRepository } from '../../repositories/users/user-repository';

interface CacheClient {
  set(key: string, value: string, mode: 'EX', ttl: number): Promise<void>;
}

const RESET_TOKEN_TTL_SECONDS = 60 * 60;

interface ForgotPasswordRequest {
  email: string;
}

export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cache: CacheClient,
  ) {}

  async execute({ email }: ForgotPasswordRequest): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) return;

    const resetToken = randomUUID();

    await this.cache.set(`reset-password:${resetToken}`, user.id, 'EX', RESET_TOKEN_TTL_SECONDS);

    await emailQueue.add('send-email', {
      to: user.email,
      subject: 'Recuperação de senha',
      body: `Use o token abaixo para redefinir sua senha (válido por 1 hora):\n\n${resetToken}`,
    });
  }
}
