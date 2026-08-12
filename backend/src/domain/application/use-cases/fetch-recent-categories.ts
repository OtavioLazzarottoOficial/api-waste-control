import { Either, right } from '@/core/either';
import { CategoriesRepository } from '../repositories/categories-repository';
import { Category } from '@/domain/enterprise/entities/category';
import { Injectable } from '@nestjs/common';

interface FetchRecentCategoriesUseCaseRequest {
  page: number;
}

type FetchRecentCategoriesUseCaseResponse = Either<
  null,
  { categories: Category[] }
>;

@Injectable()
export class FetchRecentCategoriesUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    page,
  }: FetchRecentCategoriesUseCaseRequest): Promise<FetchRecentCategoriesUseCaseResponse> {
    const categories = await this.categoriesRepository.findManyRecent({ page });

    return right({ categories });
  }
}
