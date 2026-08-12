import { Food } from '@/domain/enterprise/entities/food';
import { PaginationParams } from '@/domain/enterprise/repositories/pagination-params';

export abstract class FoodsRepository {
  abstract findById(id: string): Promise<Food | null>;
  abstract findByName(name: string): Promise<Food | null>;
  abstract findManyRecent(params: PaginationParams): Promise<Food[]>;
  abstract create(food: Food): Promise<void>;
  abstract save(food: Food): Promise<void>;
  abstract delete(food: Food): Promise<void>;
}
