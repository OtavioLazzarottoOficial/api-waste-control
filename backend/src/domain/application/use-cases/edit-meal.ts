import { TurnsType } from '@/domain/enterprise/entities/meal';
import { MealsRepository } from '../repositories/meals-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';

interface EditMealUseCaseRequest {
  mealId: string;
  date?: Date;
  turn?: TurnsType;
}

type EditMealUseCaseResponse = Either<ResourceNotFoundError, {}>;

@Injectable()
export class EditMealUseCase {
  constructor(private mealsRepository: MealsRepository) {}

  async execute({
    mealId,
    date,
    turn,
  }: EditMealUseCaseRequest): Promise<EditMealUseCaseResponse> {
    const meal = await this.mealsRepository.findById(mealId);

    if (!meal) {
      return left(new ResourceNotFoundError());
    }

    if(date) {
      meal.date = date;
    }

    if(turn) {
      meal.turn = turn;
    }

    await this.mealsRepository.save(meal);

    return right({});
  }
}
