import { makeFood } from '../../../../test/factories/make-food';
import { InMemoryFoodsRepository } from '../../../../test/repositories/in-memory-foods-repository';
import { FetchRecentFoodsUseCase } from './fetch-recent-foods';

let inMemoryFoodsRepository: InMemoryFoodsRepository;
let sut: FetchRecentFoodsUseCase;

describe('Fetch Recent Foods', () => {
  beforeEach(() => {
    inMemoryFoodsRepository = new InMemoryFoodsRepository();
    sut = new FetchRecentFoodsUseCase(inMemoryFoodsRepository);
  });

  it('should be able to fetch recent foods', async () => {
    await inMemoryFoodsRepository.create(
      makeFood({ createdAt: new Date(2022, 0, 20) }),
    );
    await inMemoryFoodsRepository.create(
      makeFood({ createdAt: new Date(2022, 0, 18) }),
    );
    await inMemoryFoodsRepository.create(
      makeFood({ createdAt: new Date(2022, 0, 23) }),
    );

    const result = await sut.execute({
      page: 1,
    });

    expect(result.value?.foods).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ]);
  });

  it('should be able to fetch paginated recent meals', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryFoodsRepository.create(makeFood());
    }

    const result = await sut.execute({
      page: 2,
    });

    expect(result.value?.foods).toHaveLength(2);
  });
});
