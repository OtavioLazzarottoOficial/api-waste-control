import { Meal } from '@/domain/enterprise/entities/meal';
import { PaginationParams } from '@/domain/enterprise/repositories/pagination-params';

export abstract class MealsRepository {
  abstract findById(id: string): Promise<Meal | null>;
  abstract findManyRecent(params: PaginationParams): Promise<Meal[]>;
  abstract create(meal: Meal): Promise<void>;
  abstract save(meal: Meal): Promise<void>;
  abstract delete(meal: Meal): Promise<void>;
}
