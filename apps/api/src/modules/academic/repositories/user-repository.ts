export interface UserData {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  cpf: string;
}

export interface UserRepository {
  findById(id: string): Promise<UserData | null>;
  findByEmail(email: string): Promise<UserData | null>;
  create(data: Omit<UserData, 'id'>): Promise<UserData>;
}