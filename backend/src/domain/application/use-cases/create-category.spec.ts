import { makeCategory } from '../../../../test/factories/make-category';
import { InMemoryCategoriesRepository } from '../../../../test/repositories/in-memory-categories-repository';
import { CreateCategoryUseCase } from './create-category';
import { CategoryAlreadyExistsError } from './errors/category-already-exists-error';

let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let sut: CreateCategoryUseCase;

describe('Create category', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository();
    sut = new CreateCategoryUseCase(inMemoryCategoriesRepository);
  });

  it('should be able to create an category', async () => {
    const newCategory = makeCategory();
    const result = await sut.execute(newCategory);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(inMemoryCategoriesRepository.items[0]).toEqual(
        result.value.category,
      );
    }
  });

  it('should not be able to create a category with an existing name', async () => {
    await inMemoryCategoriesRepository.create(makeCategory({ name: 'Carboidratos' }));

    const result = await sut.execute({ name: 'Carboidratos' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(CategoryAlreadyExistsError);
  });
});
