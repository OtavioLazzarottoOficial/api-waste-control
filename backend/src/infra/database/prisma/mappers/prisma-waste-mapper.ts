import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ReasonType, Waste } from '@/domain/enterprise/entities/waste';
import {
  Prisma,
  Waste as PrismaWaste,
  ReasonType as PrismaReasonType,
} from '@prisma/client';

export class PrismaWasteMapper {
  static toDomain(raw: PrismaWaste) {
    return Waste.create(
      {
        mealItemId: new UniqueEntityID(raw.mealItemId),
        quantity: raw.quantity,
        reason: raw.reason as ReasonType,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(waste: Waste): Prisma.WasteUncheckedCreateInput {
    return {
      id: waste.id.toString(),
      mealItemId: waste.mealItemId.toString(),
      quantity: waste.quantity,
      reason: waste.reason as unknown as PrismaReasonType,
      createdAt: waste.createdAt,
      updatedAt: waste.updatedAt,
    };
  }
}
