import { WastesRepository } from '@/domain/application/repositories/wastes-repository';
import { Waste } from '@/domain/enterprise/entities/waste';
import { WasteWithDetails } from '@/domain/enterprise/entities/value-objects/waste-with-details';
import { PaginationParams } from '@/domain/enterprise/repositories/pagination-params';
import { TurnsType } from '@/domain/enterprise/entities/meal';
import { InMemoryMealItensRepository } from './in-memory-meal-itens-repository';
import { InMemoryFoodsRepository } from './in-memory-foods-repository';
import { InMemoryCategoriesRepository } from './in-memory-categories-repository';
import { InMemoryMealsRepository } from './in-memory-meals-repository';

export class InMemoryWastesRepository implements WastesRepository {
  public items: Waste[] = [];

  constructor(
    private mealItensRepository?: InMemoryMealItensRepository,
    private foodsRepository?: InMemoryFoodsRepository,
    private categoriesRepository?: InMemoryCategoriesRepository,
    private mealsRepository?: InMemoryMealsRepository,
  ) {}

  async findById(id: string) {
    const waste = this.items.find((waste) => waste.id.toString() === id);

    if (!waste) {
      return null;
    }

    return waste;
  }

  async findManyRecent({ page }: PaginationParams) {
    const wastes = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return wastes;
  }

  async findManyWithDetailsByDateRange(startDate: Date, endDate: Date) {
    const wastes = this.items.filter((waste) => {
      return waste.createdAt >= startDate && waste.createdAt <= endDate;
    });

    const wasteWithDetailsList: WasteWithDetails[] = [];

    for (const waste of wastes) {
      const mealItem = this.mealItensRepository?.items.find(
        (mi) => mi.id.toString() === waste.mealItemId.toString(),
      );

      const food = mealItem
        ? this.foodsRepository?.items.find(
            (f) => f.id.toString() === mealItem.foodId.toString(),
          )
        : null;

      const category = food
        ? this.categoriesRepository?.items.find(
            (c) => c.id.toString() === food.categoryId.toString(),
          )
        : null;

      const meal = mealItem
        ? this.mealsRepository?.items.find(
            (m) => m.id.toString() === mealItem.mealId.toString(),
          )
        : null;

      wasteWithDetailsList.push(
        WasteWithDetails.create({
          wasteId: waste.id,
          quantity: waste.quantity,
          reason: waste.reason,
          createdAt: waste.createdAt,
          foodName: food ? food.name : 'Alimento Desconhecido',
          categoryName: category ? category.name : 'Categoria Desconhecida',
          mealDate: meal ? meal.date : new Date(),
          mealTurn: meal ? meal.turn : TurnsType.AFTERNOON,
          quantityServed: mealItem ? mealItem.quantityServed : 0,
          quantityConsumed: mealItem ? mealItem.quantityConsumed : 0,
        }),
      );
    }

    return wasteWithDetailsList;
  }

  async create(waste: Waste) {
    this.items.push(waste);
  }

  async save(waste: Waste) {
    const itemIndex = this.items.findIndex((item) => item.id === waste.id);

    this.items[itemIndex] = waste;
  }

  async delete(waste: Waste) {
    const itemIndex = this.items.findIndex((item) => item.id === waste.id);

    this.items.splice(itemIndex, 1);
  }
}
