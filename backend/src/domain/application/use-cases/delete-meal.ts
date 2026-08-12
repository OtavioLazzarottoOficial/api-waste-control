import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';
import { MealsRepository } from '../repositories/meals-repository';
import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';

interface DeleteMealUseCaseRequest {
  mealId: string;
}

type DeleteMealUseCaseResponse = Either<ResourceNotFoundError, {}>;

@Injectable()
export class DeleteMealUseCase {
  constructor(private mealsRepository: MealsRepository) {}

  async execute({
    mealId,
  }: DeleteMealUseCaseRequest): Promise<DeleteMealUseCaseResponse> {
    const meal = await this.mealsRepository.findById(mealId);

    if (!meal) {
      return left(new ResourceNotFoundError());
    }

    await this.mealsRepository.delete(meal);

    return right({});
  }
}
