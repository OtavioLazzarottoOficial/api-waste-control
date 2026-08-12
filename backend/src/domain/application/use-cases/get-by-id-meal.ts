import { Meal } from '@/domain/enterprise/entities/meal';
import { MealsRepository } from '../repositories/meals-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';

interface GetMealByIdUseCaseRequest {
  id: string;
}

type GetMealByIdUseCaseResponse = Either<ResourceNotFoundError, { meal: Meal }>;

@Injectable()
export class GetMealByIdUseCase {
  constructor(private mealsRepository: MealsRepository) {}

  async execute({
    id,
  }: GetMealByIdUseCaseRequest): Promise<GetMealByIdUseCaseResponse> {
    const meal = await this.mealsRepository.findById(id);

    if (!meal) {
      return left(new ResourceNotFoundError());
    }

    return right({
      meal,
    });
  }
}
