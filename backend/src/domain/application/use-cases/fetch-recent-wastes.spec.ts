import { makeWaste } from '../../../../test/factories/make-waste';
import { InMemoryWastesRepository } from '../../../../test/repositories/in-memory-wastes-repository';
import { FetchRecentWastesUseCase } from './fetch-recent-wastes';

let inMemoryWastesRepository: InMemoryWastesRepository;
let sut: FetchRecentWastesUseCase;

describe('Fetch Recent Wastes', () => {
  beforeEach(() => {
    inMemoryWastesRepository = new InMemoryWastesRepository();
    sut = new FetchRecentWastesUseCase(inMemoryWastesRepository);
  });

  it('should be able to fetch recent wastes', async () => {
    await inMemoryWastesRepository.create(
      makeWaste({ createdAt: new Date(2022, 0, 20) }),
    );
    await inMemoryWastesRepository.create(
      makeWaste({ createdAt: new Date(2022, 0, 18) }),
    );
    await inMemoryWastesRepository.create(
      makeWaste({ createdAt: new Date(2022, 0, 23) }),
    );

    const result = await sut.execute({
      page: 1,
    });

    expect(result.value?.wastes).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ]);
  });

  it('should be able to fetch paginated recent wastes', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryWastesRepository.create(makeWaste());
    }

    const result = await sut.execute({
      page: 2,
    });

    expect(result.value?.wastes).toHaveLength(2);
  });
});
