import { UseCaseError } from '@/core/erros/use-case-error';

export class FoodAlreadyExistsError extends Error implements UseCaseError {
  constructor(name: string) {
    super(`Food "${name}" already exists.`);
  }
}
