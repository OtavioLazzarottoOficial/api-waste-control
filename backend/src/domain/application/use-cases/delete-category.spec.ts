import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryCategoriesRepository } from '../../../../test/repositories/in-memory-categories-repository';
import { DeleteCategoryUseCase } from './delete-category';
import { makeCategory } from '../../../../test/factories/make-category';

let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let sut: DeleteCategoryUseCase;

describe('Delete Category', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository();
    sut = new DeleteCategoryUseCase(inMemoryCategoriesRepository);
  });

  it('should be able to delete a food', async () => {
    const newCategory = makeCategory({}, new UniqueEntityID('category-1'));

    await inMemoryCategoriesRepository.create(newCategory);

    await sut.execute({
      categoryId: 'category-1',
    });

    expect(inMemoryCategoriesRepository.items).toHaveLength(0);
  });
});
