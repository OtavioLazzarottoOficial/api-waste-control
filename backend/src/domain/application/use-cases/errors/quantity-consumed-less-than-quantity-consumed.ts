import { UseCaseError } from '@/core/erros/use-case-error';

export class QuantityConsumedLessThanQuantityServedError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Quantity consumed cannot be greater than quantity served.`);
  }
}
