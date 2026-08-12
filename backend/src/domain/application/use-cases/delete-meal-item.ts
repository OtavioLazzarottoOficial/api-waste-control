import { Either, left, right } from '@/core/either';
import { MealItensRepository } from '../repositories/meal-item-repository';
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';

interface DeleteMealItemUseCaseRequest {
  mealItemId: string;
}

type DeleteMealItemUseCaseResponse = Either<ResourceNotFoundError, {}>;

@Injectable()
export class DeleteMealItemUseCase {
  constructor(private mealItensRepository: MealItensRepository) {}

  async execute({
    mealItemId,
  }: DeleteMealItemUseCaseRequest): Promise<DeleteMealItemUseCaseResponse> {
    const mealItem = await this.mealItensRepository.findById(mealItemId);

    if (!mealItem) {
      return left(new ResourceNotFoundError());
    }

    await this.mealItensRepository.delete(mealItem);

    return right({});
  }
}
