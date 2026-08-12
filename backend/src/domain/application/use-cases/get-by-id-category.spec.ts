import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryCategoriesRepository } from '../../../../test/repositories/in-memory-categories-repository';
import { GetCategoryByIdUseCase } from './get-by-id-category';
import { makeCategory } from '../../../../test/factories/make-category';

let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let sut: GetCategoryByIdUseCase;

describe('Get By Id Category', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository();
    sut = new GetCategoryByIdUseCase(inMemoryCategoriesRepository);
  });

  it('should be able to get a category by id', async () => {
    const newCategory = makeCategory({}, new UniqueEntityID('category-1'));

    await inMemoryCategoriesRepository.create(newCategory);

    const result = await sut.execute({
      id: 'category-1',
    });

    expect(result.value).toMatchObject({
      category: expect.objectContaining({
        name: newCategory.name,
      }),
    });
  });
});
