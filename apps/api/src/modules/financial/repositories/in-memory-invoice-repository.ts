import type { InvoiceRepository, InvoiceData } from './invoice-repository';
import { randomUUID } from 'node:crypto';

export class InMemoryInvoiceRepository implements InvoiceRepository {
  public items: InvoiceData[] = [];

  async findById(id: string): Promise<InvoiceData | null> {
    return this.items.find((invoice) => invoice.id === id) ?? null;
  }

  async findManyByStudentId(studentId: string): Promise<InvoiceData[]> {
    return this.items.filter((invoice) => invoice.studentId === studentId);
  }

  async create(data: Omit<InvoiceData, 'id'>): Promise<InvoiceData> {
    const invoice: InvoiceData = { id: randomUUID(), ...data };
    this.items.push(invoice);
    return invoice;
  }

  async updateStatus(id: string, status: InvoiceData['status']): Promise<InvoiceData> {
    const invoice = this.items.find((item) => item.id === id);
    if (!invoice) throw new Error('Invoice not found');
    invoice.status = status;
    return invoice;
  }
}
