import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { WastesRepository } from '../repositories/wastes-repository';
import { ReasonType } from '@/domain/enterprise/entities/waste';
import { Injectable } from '@nestjs/common';
import { left, Either, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';

interface EditWasteUseCaseRequest {
  wasteId: string;
  mealItemId?: string;
  quantity?: number;
  reason?: ReasonType;
}

type EditWasteUseCaseResponse = Either<ResourceNotFoundError, {}>;

@Injectable()
export class EditWasteUseCase {
  constructor(private wastesRepository: WastesRepository) {}

  async execute({
    wasteId,
    mealItemId,
    quantity,
    reason,
  }: EditWasteUseCaseRequest): Promise<EditWasteUseCaseResponse> {
    const waste = await this.wastesRepository.findById(wasteId);

    if (!waste) {
      return left(new ResourceNotFoundError());
    }

    if (mealItemId) {
      waste.mealItemId = new UniqueEntityID(mealItemId);
    }

    if (quantity) {
      waste.quantity = quantity;
    }

    if (reason) {
      waste.reason = reason;
    }

    await this.wastesRepository.save(waste);

    return right({});
  }
}
