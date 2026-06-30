import { prisma } from '../prisma-client';
import type { InvoiceRepository, InvoiceData } from '../../../modules/financial/repositories/invoice-repository';

export class PrismaInvoiceRepository implements InvoiceRepository {
  async findById(id: string): Promise<InvoiceData | null> {
    return prisma.invoice.findUnique({ where: { id } });
  }

  async findManyByStudentId(studentId: string): Promise<InvoiceData[]> {
    return prisma.invoice.findMany({ where: { studentId } });
  }

  async create(data: Omit<InvoiceData, 'id'>): Promise<InvoiceData> {
    return prisma.invoice.create({ data });
  }

  async updateStatus(id: string, status: InvoiceData['status']): Promise<InvoiceData> {
    return prisma.invoice.update({ where: { id }, data: { status } });
  }
}