import { DomainError } from './domain-error';

export class InvalidStateTransitionError extends DomainError {
  constructor(from: string, to: string) {
    super(`Transição de status inválida: não é possível ir de ${from} para ${to}.`);
  }
}
