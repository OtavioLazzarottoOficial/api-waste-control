import { Food } from '@/domain/enterprise/entities/food';
import { Meal } from '@/domain/enterprise/entities/meal';

export class MealPresenter {
  static toHttp(meal: Meal) {
    return {
      id: meal.id.toString(),
      date: meal.date,
      turn: meal.turn,
      userId: meal.userId.toString(),
      mealItems: meal.mealItems?.map((item) => ({
        id: item.id.toString(),
        foodId: item.foodId.toString(),
        mealId: item.mealId.toString(),
        quantityConsumed: item.quantityConsumed,
        quantityServed: item.quantityServed,
        food: item.food
          ? {
              id: item.food.id.toString(),
              name: item.food.name,
              categoryId: item.food.categoryId.toString(),
              createdAt: item.food.createdAt,
              updatedAt: item.food.updatedAt,
            }
          : null,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      createdAt: meal.createdAt,
      updatedAt: meal.updatedAt,
    };
  }
}
