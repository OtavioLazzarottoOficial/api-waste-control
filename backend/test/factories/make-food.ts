import { faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Food, FoodProps } from '@/domain/enterprise/entities/food';

export function makeFood(
  override: Partial<FoodProps> = {},
  id?: UniqueEntityID,
) {
  const food = Food.create(
    {
      name: faker.food.adjective(),
      categoryId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return food;
}
