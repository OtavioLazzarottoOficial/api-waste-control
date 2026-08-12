import { Category } from '@/domain/enterprise/entities/category';

export class CategoryPresenter {
  static toHttp(category: Category) {
    return {
      id: category.id.toString(),
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
