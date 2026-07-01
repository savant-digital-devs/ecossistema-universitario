import { hash } from 'bcryptjs';
import type { UserRepository } from '../repositories/users/user-repository';
import { ResourceNotFoundError } from '../../../core/errors/resource-not-found-error';

interface CacheClient {
  get(key: string): Promise<string | null>;
  del(key: string): Promise<void>;
}

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cache: CacheClient,
  ) {}

  async execute({ token, newPassword }: ResetPasswordRequest): Promise<void> {
    const userId = await this.cache.get(`reset-password:${token}`);

    if (!userId) {
      throw new ResourceNotFoundError('Token');
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError('Usuário');
    }

    const passwordHash = await hash(newPassword, 8);

    await this.userRepository.updatePassword(user.id, passwordHash);

    await this.cache.del(`reset-password:${token}`);
  }
}
