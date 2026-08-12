import { faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  ReasonType,
  Waste,
  WasteProps,
} from '@/domain/enterprise/entities/waste';
import { ReasonType as PrismaReasonType } from '@prisma/client';

export function makeWaste(
  override: Partial<WasteProps> = {},
  id?: UniqueEntityID,
) {
  const waste = Waste.create(
    {
      mealItemId: new UniqueEntityID(),
      quantity: faker.number.int({ min: 1, max: 100 }),
      reason: PrismaReasonType.LEFTOVER as ReasonType,
      ...override,
    },
    id,
  );

  return waste;
}
