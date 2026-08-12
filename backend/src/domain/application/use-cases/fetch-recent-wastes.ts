import { Waste } from '@/domain/enterprise/entities/waste';
import { WastesRepository } from '../repositories/wastes-repository';
import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';

interface FetchRecentWastesUseCaseRequest {
  page: number;
}

type FetchRecentWastesUseCaseResponse = Either<null, { wastes: Waste[] }>;

@Injectable()
export class FetchRecentWastesUseCase {
  constructor(private wastesRepository: WastesRepository) {}

  async execute({
    page,
  }: FetchRecentWastesUseCaseRequest): Promise<FetchRecentWastesUseCaseResponse> {
    const wastes = await this.wastesRepository.findManyRecent({ page });

    return right({
      wastes,
    });
  }
}
