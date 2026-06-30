import { DomainError } from './domain-error';

export class ResourceNotFoundError extends DomainError {
  constructor(resourceName: string) {
    super(`${resourceName} não encontrado.`);
  }
}
