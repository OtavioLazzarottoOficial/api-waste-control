import { Meal } from '@/domain/enterprise/entities/meal';
import { MealsRepository } from '../repositories/meals-repository';
import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';

interface FetchRecentMealsUseCaseRequest {
  page: number;
}

type FetchRecentMealsUseCaseResponse = Either<null, { meals: Meal[] }>;

@Injectable()
export class FetchRecentMealsUseCase {
  constructor(private mealsRepository: MealsRepository) {}

  async execute({
    page,
  }: FetchRecentMealsUseCaseRequest): Promise<FetchRecentMealsUseCaseResponse> {
    const meals = await this.mealsRepository.findManyRecent({ page });

    return right({
      meals,
    });
  }
}
