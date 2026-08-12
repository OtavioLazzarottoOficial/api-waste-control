import { UseCaseError } from '@/core/erros/use-case-error';

export class CategoryAlreadyExistsError extends Error implements UseCaseError {
  constructor(name: string) {
    super(`Category "${name}" already exists.`);
  }
}
