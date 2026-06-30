import { describe, it, expect } from 'vitest';
import { OverdueInvoice } from './overdue-invoice';

describe('OverdueInvoice', () => {
  it('não aplica multa quando a fatura ainda não venceu', () => {
    const dueDate = new Date('2026-07-15');
    const referenceDate = new Date('2026-07-10');
    const invoice = new OverdueInvoice(1000, dueDate, referenceDate);

    expect(invoice.isOverdue).toBe(false);
    expect(invoice.lateFee).toBe(0);
    expect(invoice.totalAmount).toBe(1000);
  });

  it('aplica multa de 2% quando a fatura está vencida', () => {
    const dueDate = new Date('2026-07-15');
    const referenceDate = new Date('2026-07-20');
    const invoice = new OverdueInvoice(1000, dueDate, referenceDate);

    expect(invoice.isOverdue).toBe(true);
    expect(invoice.lateFee).toBe(20);
    expect(invoice.totalAmount).toBe(1020);
  });

  it('não considera vencida no dia exato do vencimento', () => {
    const dueDate = new Date('2026-07-15');
    const referenceDate = new Date('2026-07-15');
    const invoice = new OverdueInvoice(1000, dueDate, referenceDate);

    expect(invoice.isOverdue).toBe(false);
  });
});
