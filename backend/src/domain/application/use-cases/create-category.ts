import { Category } from '@/domain/enterprise/entities/category';
import { CategoriesRepository } from '../repositories/categories-repository';
import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { CategoryAlreadyExistsError } from './errors/category-already-exists-error';

interface CreateCategoryUseCaseRequest {
  name: string;
}

type CreateCategoryUseCaseResponse = Either<
  CategoryAlreadyExistsError,
  {
    category: Category;
  }
>;

@Injectable()
export class CreateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}
  async execute({
    name,
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const categoryWithSameName = await this.categoriesRepository.findByName(name);

    if (categoryWithSameName) {
      return left(new CategoryAlreadyExistsError(name));
    }

    const category = Category.create({
      name,
    });

    await this.categoriesRepository.create(category);

    return right({
      category,
    });
  }
}
