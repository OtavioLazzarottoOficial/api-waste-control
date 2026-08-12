import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { MealItem } from '@/domain/enterprise/entities/meal-item';
import { Prisma, MealItem as PrismaMealItem } from '@prisma/client';
import { PrismaFoodMapper } from './prisma-food-mapper';

type PrismaMealItemWithFood = Prisma.MealItemGetPayload<{
  include: {
    food: {
      include: {
        category: true;
      };
    };
  };
}>;

export class PrismaMealItemMapper {
  static toDomain(raw: PrismaMealItemWithFood) {
    return MealItem.create(
      {
        foodId: new UniqueEntityID(raw.foodId),
        mealId: new UniqueEntityID(raw.mealId),
        quantityConsumed: raw.quantityConsumed.toNumber(),
        quantityServed: raw.quantityServed.toNumber(),
        food: raw.food ? PrismaFoodMapper.toDomain(raw.food) : undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(mealItem: MealItem): Prisma.MealItemUncheckedCreateInput {
    return {
      id: mealItem.id.toString(),
      foodId: mealItem.foodId.toString(),
      mealId: mealItem.mealId.toString(),
      quantityConsumed: mealItem.quantityConsumed,
      quantityServed: mealItem.quantityServed,
      createdAt: mealItem.createdAt,
      updatedAt: mealItem.updatedAt,
    };
  }
}
