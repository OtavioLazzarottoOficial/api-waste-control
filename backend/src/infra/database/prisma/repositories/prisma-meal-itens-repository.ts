import { MealItensRepository } from '@/domain/application/repositories/meal-item-repository';
import { MealItem } from '@/domain/enterprise/entities/meal-item';
import { PaginationParams } from '@/domain/enterprise/repositories/pagination-params';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaMealItemMapper } from '../mappers/prisma-meal-item-mapper';

@Injectable()
export class PrismaMealItensRepository implements MealItensRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<MealItem | null> {
    const mealItem = await this.prisma.mealItem.findUnique({
      where: {
        id,
      },
      include: {
        food: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!mealItem) {
      return null;
    }

    return PrismaMealItemMapper.toDomain(mealItem);
  }

  async findManyByMealId(mealId: string): Promise<MealItem[]> {
    const mealItens = await this.prisma.mealItem.findMany({
      where: {
        mealId,
      },
      include: {
        food: {
          include: {
            category: true,
          },
        },
      },
    });

    return mealItens.map(PrismaMealItemMapper.toDomain);
  }

  async findManyRecent({ page }: PaginationParams): Promise<MealItem[]> {
    const mealItens = await this.prisma.mealItem.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        food: {
          include: {
            category: true,
          },
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return mealItens.map(PrismaMealItemMapper.toDomain);
  }

  async create(mealItem: MealItem): Promise<void> {
    const data = PrismaMealItemMapper.toPrisma(mealItem);

    await this.prisma.mealItem.create({
      data,
    });
  }

  async save(mealItem: MealItem): Promise<void> {
    const data = PrismaMealItemMapper.toPrisma(mealItem);

    await this.prisma.mealItem.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async delete(mealItem: MealItem): Promise<void> {
    const data = PrismaMealItemMapper.toPrisma(mealItem);

    await this.prisma.mealItem.delete({
      where: {
        id: data.id,
      },
    });
  }
}
