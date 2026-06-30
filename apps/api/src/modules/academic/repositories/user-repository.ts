export interface UserData {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  cpf: string;
  role: 'ADMIN' | 'PROFESSOR' | 'STUDENT';
}

export interface UserRepository {
  findById(id: string): Promise<UserData | null>;
  findByEmail(email: string): Promise<UserData | null>;
  create(data: Omit<UserData, 'id' | 'role'>): Promise<UserData>;
}