import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryInvoiceRepository } from './in-memory-invoice-repository';

describe('InMemoryInvoiceRepository', () => {
  let repository: InMemoryInvoiceRepository;

  beforeEach(() => {
    repository = new InMemoryInvoiceRepository();
  });

  it('cria uma fatura', async () => {
    const invoice = await repository.create({
      studentId: 'student-1',
      amount: 500 as any,
      dueDate: new Date('2026-08-10'),
      status: 'PENDING',
      type: 'TUITION',
    });

    expect(invoice.id).toBeDefined();
    expect(invoice.status).toBe('PENDING');
  });

  it('lista faturas por aluno', async () => {
    await repository.create({
      studentId: 'student-1',
      amount: 500 as any,
      dueDate: new Date('2026-08-10'),
      status: 'PENDING',
      type: 'TUITION',
    });
    await repository.create({
      studentId: 'student-2',
      amount: 300 as any,
      dueDate: new Date('2026-08-10'),
      status: 'PENDING',
      type: 'TUITION',
    });

    const found = await repository.findManyByStudentId('student-1');

    expect(found).toHaveLength(1);
  });

  it('atualiza o status de uma fatura', async () => {
    const created = await repository.create({
      studentId: 'student-1',
      amount: 500 as any,
      dueDate: new Date('2026-08-10'),
      status: 'PENDING',
      type: 'TUITION',
    });

    const updated = await repository.updateStatus(created.id, 'PAID');

    expect(updated.status).toBe('PAID');
  });
});