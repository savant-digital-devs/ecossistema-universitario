const LATE_FEE_PERCENTAGE = 0.02;

export class OverdueInvoice {
  private readonly amount: number;
  private readonly dueDate: Date;
  private readonly referenceDate: Date;

  constructor(amount: number, dueDate: Date, referenceDate: Date = new Date()) {
    this.amount = amount;
    this.dueDate = dueDate;
    this.referenceDate = referenceDate;
  }

  get isOverdue(): boolean {
    return this.referenceDate > this.dueDate;
  }

  get lateFee(): number {
    if (!this.isOverdue) return 0;
    return this.amount * LATE_FEE_PERCENTAGE;
  }

  get totalAmount(): number {
    return this.amount + this.lateFee;
  }
}
