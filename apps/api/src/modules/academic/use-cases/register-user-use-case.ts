import { hash } from 'bcryptjs';
import type { UserRepository } from '../repositories/user-repository';

interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
  cpf: string;
}

interface RegisterUserResponse {
  id: string;
  name: string;
  email: string;
}

export class RegisterUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    name,
    email,
    password,
    cpf,
  }: RegisterUserRequest): Promise<RegisterUserResponse> {
    const userAlreadyExists = await this.userRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new Error('E-mail já cadastrado.');
    }

    const passwordHash = await hash(password, 8);

    const user = await this.userRepository.create({
      name,
      email,
      passwordHash,
      cpf,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}