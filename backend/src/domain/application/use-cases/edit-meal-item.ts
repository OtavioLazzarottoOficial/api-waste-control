import { MealItensRepository } from '../repositories/meal-item-repository';
import { UniqueEntityID } from '../../../core/entities/unique-entity-id';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';

interface EditMealItemUseCaseRequest {
  mealItemId: string;
  mealId?: string;
  foodId?: string;
  quantityServed?: number;
  quantityConsumed?: number;
}

type EditMealItemUseCaseResponse = Either<ResourceNotFoundError, {}>;

@Injectable()
export class EditMealItemUseCase {
  constructor(private mealItensRepository: MealItensRepository) {}

  async execute({
    mealItemId,
    mealId,
    foodId,
    quantityServed,
    quantityConsumed,
  }: EditMealItemUseCaseRequest): Promise<EditMealItemUseCaseResponse> {
    const mealItem = await this.mealItensRepository.findById(mealItemId);

    if (!mealItem) {
      return left(new ResourceNotFoundError());
    }

    if (mealId) {
      mealItem.mealId = new UniqueEntityID(mealId);
    }

    if (foodId) {
      mealItem.foodId = new UniqueEntityID(foodId);
    }

    if (quantityServed) {
      mealItem.quantityServed = quantityServed;
    }

    if (quantityConsumed) {
      mealItem.quantityConsumed = quantityConsumed;
    }

    await this.mealItensRepository.save(mealItem);

    return right({});
  }
}
