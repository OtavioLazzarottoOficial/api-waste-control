import { Meal, TurnsType } from '@/domain/enterprise/entities/meal';
import { MealsRepository } from '../repositories/meals-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';

interface CreateMealUseCaseRequest {
  date: Date;
  turn: TurnsType;
  userId: string;
}

type CreateMealUseCaseResponse = Either<null, { meal: Meal }>;

@Injectable()
export class CreateMealUseCase {
  constructor(private mealsRepository: MealsRepository) {}

  async execute({
    date,
    turn,
    userId,
  }: CreateMealUseCaseRequest): Promise<CreateMealUseCaseResponse> {
    const meal = Meal.create({
      date,
      turn,
      userId: new UniqueEntityID(userId),
    });

    await this.mealsRepository.create(meal);

    return right({
      meal,
    });
  }
}
