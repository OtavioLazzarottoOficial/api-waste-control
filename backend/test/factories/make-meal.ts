import { faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Meal, MealProps, TurnsType } from '@/domain/enterprise/entities/meal';
import { TurnsType as PrismaTurnsType } from '@prisma/client';

export function makeMeal(
  override: Partial<MealProps> = {},
  id?: UniqueEntityID,
) {
  const meal = Meal.create(
    {
      date: faker.date.future({ years: 1 }),
      turn: PrismaTurnsType.AFTERNOON as TurnsType,
      userId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return meal;
}
