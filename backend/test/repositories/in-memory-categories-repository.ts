import { CategoriesRepository } from '@/domain/application/repositories/categories-repository';
import { Category } from '@/domain/enterprise/entities/category';
import { PaginationParams } from '@/domain/enterprise/repositories/pagination-params';

export class InMemoryCategoriesRepository implements CategoriesRepository {
  public items: Category[] = [];

  async findById(id: string) {
    const category = this.items.find(
      (category) => category.id.toString() === id,
    );

    if (!category) {
      return null;
    }

    return category;
  }

  async findByName(name: string) {
    const category = this.items.find(
      (category) => category.name.toLowerCase() === name.toLowerCase(),
    );

    if (!category) {
      return null;
    }

    return category;
  }

  async findManyRecent({ page }: PaginationParams) {
    const categories = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return categories;
  }

  async create(category: Category) {
    this.items.push(category);
  }

  async save(category: Category) {
    const itemIndex = this.items.findIndex((item) => item.id === category.id);

    this.items[itemIndex] = category;
  }

  async delete(category: Category) {
    const itemIdex = this.items.findIndex((item) => item.id === category.id);

    this.items.splice(itemIdex, 1);
  }
}
