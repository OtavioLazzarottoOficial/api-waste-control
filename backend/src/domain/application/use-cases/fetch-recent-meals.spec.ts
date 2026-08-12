import { makeMeal } from "../../../../test/factories/make-meal";
import { InMemoryMealsRepository } from "../../../../test/repositories/in-memory-meals-repository";
import { FetchRecentMealsUseCase } from "./fetch-recent-meals";

let inMemoryMealsRepository: InMemoryMealsRepository;
let sut: FetchRecentMealsUseCase;

describe('Fetch Recent Meals', () => {
  beforeEach(() => {
    inMemoryMealsRepository = new InMemoryMealsRepository();
    sut = new FetchRecentMealsUseCase(inMemoryMealsRepository);
  });

  it('should be able to fetch recent meals', async () => {
    await inMemoryMealsRepository.create(
      makeMeal({ createdAt: new Date(2022, 0, 20) }),
    );
    await inMemoryMealsRepository.create(
      makeMeal({ createdAt: new Date(2022, 0, 18) }),
    );
    await inMemoryMealsRepository.create(
      makeMeal({ createdAt: new Date(2022, 0, 23) }),
    );

    const result = await sut.execute({
      page: 1,
    });

    expect(result.value?.meals).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ]);
  });

  it('should be able to fetch paginated recent meals', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryMealsRepository.create(makeMeal());
    }

    const result = await sut.execute({
      page: 2,
    });

    expect(result.value?.meals).toHaveLength(2);
  });
});
