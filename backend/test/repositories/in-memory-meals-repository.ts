import { MealsRepository } from '@/domain/application/repositories/meals-repository';
import { Meal } from '@/domain/enterprise/entities/meal';
import { PaginationParams } from '@/domain/enterprise/repositories/pagination-params';

export class InMemoryMealsRepository implements MealsRepository {
  public items: Meal[] = [];

  async findById(id: string) {
    const meal = this.items.find((meal) => meal.id.toString() === id);

    if (!meal) {
      return null;
    }

    return meal;
  }

  async findManyRecent({ page }: PaginationParams) {
    const meals = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return meals;
  }

  async create(meal: Meal) {
    this.items.push(meal);
  }

  async save(meal: Meal) {
    const itemIndex = this.items.findIndex((item) => item.id === meal.id);

    this.items[itemIndex] = meal;
  }

  async delete(meal: Meal) {
    const itemIndex = this.items.findIndex((item) => item.id === meal.id);

    this.items.splice(itemIndex, 1)
  }
}
