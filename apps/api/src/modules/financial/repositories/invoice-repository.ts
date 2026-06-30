import { Decimal } from '../../../infra/database/generated/internal/prismaNamespace';

export interface InvoiceData {
  id: string;
  studentId: string;
  amount: Decimal;
  dueDate: Date;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  type: string;
}

export interface InvoiceRepository {
  findById(id: string): Promise<InvoiceData | null>;
  findManyByStudentId(studentId: string): Promise<InvoiceData[]>;
  create(data: Omit<InvoiceData, 'id'>): Promise<InvoiceData>;
  updateStatus(id: string, status: InvoiceData['status']): Promise<InvoiceData>;
}
