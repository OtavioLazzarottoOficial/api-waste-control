import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { MealItensRepository } from '../repositories/meal-item-repository';
import { MealItem } from '@/domain/enterprise/entities/meal-item';
import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { QuantityConsumedLessThanQuantityServedError } from './errors/quantity-consumed-less-than-quantity-consumed';

interface CreateMealItemUseCaseRequest {
  mealId: string;
  foodId: string;
  quantityServed: number;
  quantityConsumed: number;
}

type CreateMealItemUseCaseResponse = Either<
  QuantityConsumedLessThanQuantityServedError,
  {
    mealItem: MealItem;
  }
>;

@Injectable()
export class CreateMealItemUseCase {
  constructor(private mealItensRepository: MealItensRepository) {}

  async execute({
    mealId,
    foodId,
    quantityServed,
    quantityConsumed,
  }: CreateMealItemUseCaseRequest): Promise<CreateMealItemUseCaseResponse> {


    if(quantityConsumed > quantityServed) {
      return left(new QuantityConsumedLessThanQuantityServedError());
    }

    const mealItem = MealItem.create({
      mealId: new UniqueEntityID(mealId),
      foodId: new UniqueEntityID(foodId),
      quantityConsumed,
      quantityServed,
    });

    await this.mealItensRepository.create(mealItem);

    return right({
      mealItem,
    });
  }
}
