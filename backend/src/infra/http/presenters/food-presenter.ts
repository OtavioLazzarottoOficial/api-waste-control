import { Category } from '@/domain/enterprise/entities/category';
import { Food } from '@/domain/enterprise/entities/food';

export class FoodPresenter {
  static toHttp(food: Food) {
    return {
      id: food.id.toString(),
      name: food.name,
      categoryId: food.categoryId.toString(),
      category: food.category
        ? {
            id: food.category.id.toString(),
            name: food.category.name,
          }
        : null,
      createdAt: food.createdAt,
      updatedAt: food.updatedAt,
    };
  }
}
