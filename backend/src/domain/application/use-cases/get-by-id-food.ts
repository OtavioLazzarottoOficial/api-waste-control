import { Food } from '@/domain/enterprise/entities/food';
import { FoodsRepository } from '../repositories/foods-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';

interface GetFoodByIdUseCaseRequest {
  id: string;
}

type GetFoodByIdUseCaseResponse = Either<ResourceNotFoundError, { food: Food }>;

@Injectable()
export class GetFoodByIdUseCase {
  constructor(private foodsRepository: FoodsRepository) {}

  async execute({
    id,
  }: GetFoodByIdUseCaseRequest): Promise<GetFoodByIdUseCaseResponse> {
    const food = await this.foodsRepository.findById(id);

    if (!food) {
      return left(new ResourceNotFoundError());
    }

    return right({
      food,
    });
  }
}
