import { faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { MealItem } from '@/domain/enterprise/entities/meal-item';

export function makeMealItem(
  override: Partial<MealItem> = {},
  id?: UniqueEntityID,
) {
  const mealItem = MealItem.create(
    {
      mealId: new UniqueEntityID(),
      foodId: new UniqueEntityID(),
      quantityServed: faker.number.float({
        min: 10,
        max: 100,
        multipleOf: 0.02,
      }),
      quantityConsumed: faker.number.float({
        min: 10,
        max: 100,
        multipleOf: 0.02,
      }),
      ...override,
    },
    id,
  );

  return mealItem
}
