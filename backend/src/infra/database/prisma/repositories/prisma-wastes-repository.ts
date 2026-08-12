import { WastesRepository } from '@/domain/application/repositories/wastes-repository';
import { Waste } from '@/domain/enterprise/entities/waste';
import { WasteWithDetails } from '@/domain/enterprise/entities/value-objects/waste-with-details';
import { ReasonType } from '@/domain/enterprise/entities/waste';
import { TurnsType } from '@/domain/enterprise/entities/meal';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PaginationParams } from '@/domain/enterprise/repositories/pagination-params';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaWasteMapper } from '../mappers/prisma-waste-mapper';

@Injectable()
export class PrismaWastesRepository implements WastesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Waste | null> {
    const waste = await this.prisma.waste.findUnique({
      where: {
        id,
      },
    });

    if (!waste) {
      return null;
    }

    return PrismaWasteMapper.toDomain(waste);
  }

  async findManyRecent({ page }: PaginationParams): Promise<Waste[]> {
    const wastes = await this.prisma.waste.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return wastes.map(PrismaWasteMapper.toDomain);
  }

  async findManyWithDetailsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<WasteWithDetails[]> {
    const wastes = await this.prisma.waste.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        mealItem: {
          include: {
            meal: true,
            food: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    return wastes.map((raw) => {
      return WasteWithDetails.create({
        wasteId: new UniqueEntityID(raw.id),
        quantity: raw.quantity,
        reason: raw.reason as unknown as ReasonType,
        createdAt: raw.createdAt,
        foodName: raw.mealItem.food.name,
        categoryName: raw.mealItem.food.category.name,
        mealDate: raw.mealItem.meal.date,
        mealTurn: raw.mealItem.meal.turn as unknown as TurnsType,
        quantityServed: raw.mealItem.quantityServed.toNumber(),
        quantityConsumed: raw.mealItem.quantityConsumed.toNumber(),
      });
    });
  }

  async create(waste: Waste): Promise<void> {
    const data = PrismaWasteMapper.toPrisma(waste);

    await this.prisma.waste.create({
      data,
    });
  }

  async save(waste: Waste): Promise<void> {
    const data = PrismaWasteMapper.toPrisma(waste);

    await this.prisma.waste.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async delete(waste: Waste): Promise<void> {
    const data = PrismaWasteMapper.toPrisma(waste);

    await this.prisma.waste.delete({
      where: {
        id: data.id,
      },
    });
  }
}
