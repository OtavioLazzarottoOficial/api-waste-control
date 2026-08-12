import { FoodsRepository } from '@/domain/application/repositories/foods-repository';
import { Food } from '@/domain/enterprise/entities/food';
import { PaginationParams } from '@/domain/enterprise/repositories/pagination-params';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaFoodMapper } from '../mappers/prisma-food-mapper';

@Injectable()
export class PrismaFoodsRepository implements FoodsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Food | null> {
    const food = await this.prisma.food.findUnique({
      include: {
        category: true,
      },
      where: {
        id,
      },
    });

    if (!food) {
      return null;
    }

    return PrismaFoodMapper.toDomain(food);
  }

  async findByName(name: string): Promise<Food | null> {
    const food = await this.prisma.food.findFirst({
      include: {
        category: true,
      },
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    if (!food) {
      return null;
    }

    return PrismaFoodMapper.toDomain(food);
  }

  async findManyRecent({ page }: PaginationParams): Promise<Food[]> {
    const foods = await this.prisma.food.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return foods.map(PrismaFoodMapper.toDomain);
  }

  async create(food: Food): Promise<void> {
    const data = PrismaFoodMapper.toPrisma(food);

    await this.prisma.food.create({
      data,
    });
  }

  async save(food: Food): Promise<void> {
    const data = PrismaFoodMapper.toPrisma(food);

    await this.prisma.food.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async delete(food: Food): Promise<void> {
    const data = PrismaFoodMapper.toPrisma(food);

    await this.prisma.food.delete({
      where: {
        id: data.id,
      },
    });
  }
}
