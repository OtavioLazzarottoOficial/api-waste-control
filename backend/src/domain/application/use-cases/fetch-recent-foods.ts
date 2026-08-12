import { Food } from '@/domain/enterprise/entities/food';
import { FoodsRepository } from '../repositories/foods-repository';
import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';

interface FetchRecentFoodsUseCaseRequest {
  page: number;
}

type FetchRecentFoodsUseCaseResponse = Either<null, { foods: Food[] }>;

@Injectable()
export class FetchRecentFoodsUseCase {
  constructor(private foodsRepository: FoodsRepository) {}

  async execute({
    page,
  }: FetchRecentFoodsUseCaseRequest): Promise<FetchRecentFoodsUseCaseResponse> {
    const foods = await this.foodsRepository.findManyRecent({ page });

    return right({
      foods,
    });
  }
}
