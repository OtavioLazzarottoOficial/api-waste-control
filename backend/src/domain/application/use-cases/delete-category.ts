import { Either, left, Left, right } from '@/core/either';
import { CategoriesRepository } from '../repositories/categories-repository';
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';

interface DeleteCategoryUseCaseRequest {
  categoryId: string;
}

type DeleteCategoryUseCaseResponse = Either<ResourceNotFoundError, {}>;

@Injectable()
export class DeleteCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    categoryId,
  }: DeleteCategoryUseCaseRequest): Promise<DeleteCategoryUseCaseResponse> {
    const category = await this.categoriesRepository.findById(categoryId);

    if (!category) {
      return left(new ResourceNotFoundError());
    }

    await this.categoriesRepository.delete(category);

    return right({});
  }
}
