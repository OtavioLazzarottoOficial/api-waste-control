import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';
import { FoodsRepository } from '../repositories/foods-repository';
import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';

interface DeleteFoodUseCaseRequest {
  foodId: string;
}

type DeleteFoodUseCaseResponse = Either<ResourceNotFoundError, {}>;

@Injectable()
export class DeleteFoodUseCase {
  constructor(private foodsRepository: FoodsRepository) {}

  async execute({
    foodId,
  }: DeleteFoodUseCaseRequest): Promise<DeleteFoodUseCaseResponse> {
    const food = await this.foodsRepository.findById(foodId);

    if (!food) {
      return left(new ResourceNotFoundError());
    }

    await this.foodsRepository.delete(food);

    return right({});
  }
}
