import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ReasonType, Waste } from '@/domain/enterprise/entities/waste';
import { WastesRepository } from '../repositories/wastes-repository';
import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';

interface CreateWasteUseCaseRequest {
  mealItemId: string;
  quantity: number;
  reason: ReasonType;
}

type CreateWasteUseCaseResponse = Either<
  null,
  {
    waste: Waste;
  }
>;

@Injectable()
export class CreateWasteUseCase {
  constructor(private wastesRepository: WastesRepository) {}

  async execute({
    mealItemId,
    quantity,
    reason,
  }: CreateWasteUseCaseRequest): Promise<CreateWasteUseCaseResponse> {
    const waste = Waste.create({
      quantity,
      mealItemId: new UniqueEntityID(mealItemId),
      reason,
    });

    await this.wastesRepository.create(waste);

    return right({
      waste,
    });
  }
}
