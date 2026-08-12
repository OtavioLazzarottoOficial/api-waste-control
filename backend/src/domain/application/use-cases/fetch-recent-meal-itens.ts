import { MealItem } from '@/domain/enterprise/entities/meal-item';
import { MealItensRepository } from '../repositories/meal-item-repository';
import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';

interface FetchRecentMealItensUseCaseRequest {
  page: number;
}

type FetchRecentMealItensUseCaseResponse = Either<
  null,
  { mealItens: MealItem[] }
>;

@Injectable()
export class FetchRecentMealItensUseCase {
  constructor(private mealItensRepository: MealItensRepository) {}

  async execute({
    page,
  }: FetchRecentMealItensUseCaseRequest): Promise<FetchRecentMealItensUseCaseResponse> {
    const mealItens = await this.mealItensRepository.findManyRecent({ page });

    return right({
      mealItens,
    });
  }
}
