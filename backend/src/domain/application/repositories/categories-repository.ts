import { Category } from '@/domain/enterprise/entities/category';
import { PaginationParams } from '@/domain/enterprise/repositories/pagination-params';

export abstract class CategoriesRepository {
  abstract findById(id: string): Promise<Category | null>
  abstract findByName(name: string): Promise<Category | null>;
  abstract findManyRecent(params: PaginationParams): Promise<Category[]>;
  abstract create(category: Category): Promise<void>;
  abstract save(category: Category): Promise<void>;
  abstract delete(category: Category): Promise<void>;
}
