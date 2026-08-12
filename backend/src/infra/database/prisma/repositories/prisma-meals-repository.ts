import { MealsRepository } from '@/domain/application/repositories/meals-repository';
import { Meal } from '@/domain/enterprise/entities/meal';
import { PaginationParams } from '@/domain/enterprise/repositories/pagination-params';
import { Injectable } from '@nestjs/common';
import { PrismaMealMapper } from '../mappers/prisma-meal-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaMealsRepository implements MealsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Meal | null> {
    const meal = await this.prisma.meal.findUnique({
      where: {
        id,
      },
      include: {
        mealItems: {
          include: {
            food: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!meal) {
      return null;
    }

    console.log(meal);

    return PrismaMealMapper.toDomain(meal);
  }

  async findManyItemMealsWithMeal(mealId: string): Promise<Meal[]> {
    const meals = await this.prisma.meal.findMany({
      include: {
        mealItems: {
          include: {
            food: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      where: {
        mealItems: {
          some: {
            mealId,
          },
        },
      },
    });

    return meals.map(PrismaMealMapper.toDomain);
  }

  async findManyRecent({ page }: PaginationParams): Promise<Meal[]> {
    const meals = await this.prisma.meal.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
      include: {
        mealItems: {
          include: {
            food: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    return meals.map(PrismaMealMapper.toDomain);
  }

  async create(meal: Meal): Promise<void> {
    const data = PrismaMealMapper.toPrisma(meal);

    await this.prisma.meal.create({
      data,
    });
  }

  async save(meal: Meal): Promise<void> {
    const data = PrismaMealMapper.toPrisma(meal);

    await this.prisma.meal.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async delete(meal: Meal): Promise<void> {
    const data = PrismaMealMapper.toPrisma(meal);

    await this.prisma.meal.delete({
      where: {
        id: data.id,
      },
    });
  }
}
