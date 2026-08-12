import { MealItensRepository } from '@/domain/application/repositories/meal-item-repository';
import { MealItem } from '@/domain/enterprise/entities/meal-item';
import { PaginationParams } from '@/domain/enterprise/repositories/pagination-params';

export class InMemoryMealItensRepository implements MealItensRepository {
  public items: MealItem[] = [];

  async findById(id: string) {
    const mealItem = this.items.find(
      (mealItem) => mealItem.id.toString() === id,
    );

    if (!mealItem) {
      return null;
    }

    return mealItem;
  }

  async findManyRecent({ page }: PaginationParams) {
    const mealItens = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return mealItens;
  }

  async findManyByMealId(mealId: string) {
    const mealItems = this.items.filter(
      (mealItem) => mealItem.mealId.toString() === mealId,
    );

    if (!mealItems) {
      return null;
    }

    return mealItems;
  }

  async create(mealItem: MealItem) {
    this.items.push(mealItem);
  }

  async save(mealItem: MealItem) {
    const itemIndex = this.items.findIndex((item) => item.id === mealItem.id);

    this.items[itemIndex] = mealItem;
  }

  async delete(mealItem: MealItem) {
    const itemIndex = this.items.findIndex((item) => item.id === mealItem.id);

    this.items.splice(itemIndex, 1);
  }
}
