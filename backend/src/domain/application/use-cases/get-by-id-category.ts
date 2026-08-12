import { Category } from '@/domain/enterprise/entities/category';
import { CategoriesRepository } from '../repositories/categories-repository';
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';
import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';

interface GetCategoryByIdUseCaseRequest {
  id: string;
}

type GetCategoryByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  { category: Category }
>;

@Injectable()
export class GetCategoryByIdUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    id,
  }: GetCategoryByIdUseCaseRequest): Promise<GetCategoryByIdUseCaseResponse> {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      return left(new ResourceNotFoundError());
    }

    return right({
      category,
    });
  }
}
