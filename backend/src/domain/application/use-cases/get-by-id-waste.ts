import { Waste } from '@/domain/enterprise/entities/waste';
import { WastesRepository } from '../repositories/wastes-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';

interface GetWasteByIdUseCaseRequest {
  id: string;
}

type GetWasteByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  { waste: Waste }
>;

@Injectable()
export class GetWasteByIdUseCase {
  constructor(private wastesRepository: WastesRepository) {}

  async execute({
    id,
  }: GetWasteByIdUseCaseRequest): Promise<GetWasteByIdUseCaseResponse> {
    const waste = await this.wastesRepository.findById(id);

    if (!waste) {
      return left(new ResourceNotFoundError());
    }

    return right({
      waste,
    });
  }
}
