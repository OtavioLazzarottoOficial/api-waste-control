import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeCategory } from '../../../../test/factories/make-category';
import { InMemoryCategoriesRepository } from '../../../../test/repositories/in-memory-categories-repository';
import { EditCategoryUseCase } from './edit-category';
import { CategoryAlreadyExistsError } from './errors/category-already-exists-error';

let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let sut: EditCategoryUseCase;

describe('Edit Category', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository();
    sut = new EditCategoryUseCase(inMemoryCategoriesRepository);
  });

  it('should be able to edit a food', async () => {
    const newCategory = makeCategory(
      { name: 'frango' },
      new UniqueEntityID('category-1'),
    );

    await inMemoryCategoriesRepository.create(newCategory);

    await sut.execute({
      categoryId: newCategory.id.toString(),
      name: 'frango Sadia',
    });

    expect(inMemoryCategoriesRepository.items[0]).toMatchObject({
      name: 'frango Sadia',
    });
  });

  it('should not be able to edit a category to an existing name', async () => {
    const category1 = makeCategory({ name: 'Carboidratos' }, new UniqueEntityID('category-1'));
    const category2 = makeCategory({ name: 'Proteínas' }, new UniqueEntityID('category-2'));

    await inMemoryCategoriesRepository.create(category1);
    await inMemoryCategoriesRepository.create(category2);

    const result = await sut.execute({
      categoryId: 'category-2',
      name: 'Carboidratos',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(CategoryAlreadyExistsError);
  });
});
