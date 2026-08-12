import { Food } from '@/domain/enterprise/entities/food';
import { FoodsRepository } from '../repositories/foods-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { FoodAlreadyExistsError } from './errors/food-already-exists-error';

interface CreateFoodUseCaseRequest {
  name: string;
  categoryId: string;
}

type CreateFoodUseCaseResponse = Either<
  FoodAlreadyExistsError,
  {
    food: Food;
  }
>;

@Injectable()
export class CreateFoodUseCase {
  constructor(private foodsRepository: FoodsRepository) {}

  async execute({
    name,
    categoryId,
  }: CreateFoodUseCaseRequest): Promise<CreateFoodUseCaseResponse> {
    const foodWithSameName = await this.foodsRepository.findByName(name);

    if (foodWithSameName) {
      return left(new FoodAlreadyExistsError(name));
    }

    const food = Food.create({
      name,
      categoryId: new UniqueEntityID(categoryId),
    });

    await this.foodsRepository.create(food);

    return right({
      food,
    });
  }
}
