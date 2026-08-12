import { FoodsRepository } from '@/domain/application/repositories/foods-repository';
import { Food } from '@/domain/enterprise/entities/food';
import { PaginationParams } from '@/domain/enterprise/repositories/pagination-params';

export class InMemoryFoodsRepository implements FoodsRepository {
  public items: Food[] = [];

  async findById(id: string) {
    const food = this.items.find((food) => food.id.toString() === id);

    if (!food) {
      return null;
    }

    return food;
  }

  async findByName(name: string) {
    const food = this.items.find(
      (food) => food.name.toLowerCase() === name.toLowerCase(),
    );

    if (!food) {
      return null;
    }

    return food;
  }

  async findManyRecent({ page }: PaginationParams) {
    const foods = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return foods;
  }

  async create(food: Food) {
    this.items.push(food);
  }

  async save(food: Food) {
    const itemIndex = this.items.findIndex((item) => item.id === food.id);

    this.items[itemIndex] = food;
  }

  async delete(food: Food) {
    const itemIndex = this.items.findIndex((item) => item.id === food.id);

    this.items.splice(itemIndex, 1);
  }
}
