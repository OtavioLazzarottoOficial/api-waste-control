import { UseCaseError } from '@/core/erros/use-case-error';

export class InvalidDatesError extends Error implements UseCaseError {
  constructor() {
    super('Start date must be before end date.');
  }
}
