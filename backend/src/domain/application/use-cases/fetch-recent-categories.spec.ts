import { makeCategory } from '../../../../test/factories/make-category';
import { InMemoryCategoriesRepository } from '../../../../test/repositories/in-memory-categories-repository';
import { FetchRecentCategoriesUseCase } from './fetch-recent-categories';

let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let sut: FetchRecentCategoriesUseCase;

describe('Fetch Recent Foods', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository();
    sut = new FetchRecentCategoriesUseCase(inMemoryCategoriesRepository);
  });

  it('should be able to fetch recent foods', async () => {
    await inMemoryCategoriesRepository.create(
      makeCategory({ createdAt: new Date(2022, 0, 20) }),
    );
    await inMemoryCategoriesRepository.create(
      makeCategory({ createdAt: new Date(2022, 0, 18) }),
    );
    await inMemoryCategoriesRepository.create(
      makeCategory({ createdAt: new Date(2022, 0, 23) }),
    );

    const result = await sut.execute({
      page: 1,
    });

    expect(result.value?.categories).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ]);
  });

  it('should be able to fetch paginated recent meals', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryCategoriesRepository.create(makeCategory());
    }

    const result = await sut.execute({
      page: 2,
    });

    expect(result.value?.categories).toHaveLength(2);
  });
});
