import { MealItem } from '@/domain/enterprise/entities/meal-item';
import { MealItensRepository } from '../repositories/meal-item-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';

interface GetMealItemByIdUseCaseRequest {
  id: string;
}

type GetMealItemByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  { mealItem: MealItem }
>;

@Injectable()
export class GetMealItemByIdUseCase {
  constructor(private mealItensRepository: MealItensRepository) {}

  async execute({
    id,
  }: GetMealItemByIdUseCaseRequest): Promise<GetMealItemByIdUseCaseResponse> {
    const mealItem = await this.mealItensRepository.findById(id);

    if (!mealItem) {
      return left(new ResourceNotFoundError());
    }

    return right({
      mealItem,
    });
  }
}
