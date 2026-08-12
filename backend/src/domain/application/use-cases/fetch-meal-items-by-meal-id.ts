import { MealItem } from '@/domain/enterprise/entities/meal-item';
import { MealItensRepository } from '../repositories/meal-item-repository';
import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';

interface FetchMealItemsByMealIdUseCaseRequest {
  mealId: string;
}

type FetchMealItemsByMealIdUseCaseResponse = Either<
  null,
  { mealItens: MealItem[] }
>;

@Injectable()
export class FetchMealItemsByMealIdUseCase {
  constructor(private mealItensRepository: MealItensRepository) {}

  async execute({
    mealId,
  }: FetchMealItemsByMealIdUseCaseRequest): Promise<FetchMealItemsByMealIdUseCaseResponse> {
    const mealItens = await this.mealItensRepository.findManyByMealId(mealId);

    if (!mealItens) {
      return right({ mealItens: [] });
    }

    return right({
      mealItens,
    });
  }
}
