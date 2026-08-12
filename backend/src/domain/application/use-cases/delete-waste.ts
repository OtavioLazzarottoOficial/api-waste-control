import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';
import { WastesRepository } from '../repositories/wastes-repository';
import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';

interface DeleteWasteUseCaseRequest {
  wasteId: string;
}

type DeleteWasteUseCaseResponse = Either<ResourceNotFoundError, {}>;

@Injectable()
export class DeleteWasteUseCase {
  constructor(private wastesRepository: WastesRepository) {}

  async execute({
    wasteId,
  }: DeleteWasteUseCaseRequest): Promise<DeleteWasteUseCaseResponse> {
    const waste = await this.wastesRepository.findById(wasteId);

    if (!waste) {
      return left(new ResourceNotFoundError());
    }

    await this.wastesRepository.delete(waste);

    return right({});
  }
}
