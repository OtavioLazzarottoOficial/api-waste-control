import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Category } from '@/domain/enterprise/entities/category';
import { Food } from '@/domain/enterprise/entities/food';
import { Prisma, Food as PrismaFood } from '@prisma/client';
import { PrismaCategoryMapper } from './prisma-category-mapper';

type PrismaFoodWithCategory = Prisma.FoodGetPayload<{
  include: {
    category: true;
  };
}>;

export class PrismaFoodMapper {
  static toDomain(raw: PrismaFoodWithCategory) {
    return Food.create(
      {
        name: raw.name,
        categoryId: new UniqueEntityID(raw.categoryId),
        category: raw.category
          ? PrismaCategoryMapper.toDomain(raw.category)
          : undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toDomainNoCategory(raw: PrismaFoodWithCategory) {
    return Food.create(
      {
        name: raw.name,
        categoryId: new UniqueEntityID(raw.categoryId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(food: Food): Prisma.FoodUncheckedCreateInput {
    return {
      id: food.id.toString(),
      categoryId: food.categoryId.toString(),
      name: food.name,
      createdAt: food.createdAt,
      updatedAt: food.createdAt,
    };
  }
}
