import { makeMealItem } from "../../../../test/factories/make-meal-item";
import { InMemoryMealItensRepository } from "../../../../test/repositories/in-memory-meal-itens-repository";
import { FetchRecentMealItensUseCase } from "./fetch-recent-meal-itens";


let inMemoryMealItensRepository: InMemoryMealItensRepository;
let sut: FetchRecentMealItensUseCase;

describe('Fetch Recent Meal itens', () => {
  beforeEach(() => {
    inMemoryMealItensRepository = new InMemoryMealItensRepository();
    sut = new FetchRecentMealItensUseCase(inMemoryMealItensRepository);
  });

  it('should be able to fetch recent meal itens', async () => {
    await inMemoryMealItensRepository.create(
      makeMealItem({ createdAt: new Date(2022, 0, 20) }),
    );
    await inMemoryMealItensRepository.create(
      makeMealItem({ createdAt: new Date(2022, 0, 18) }),
    );
    await inMemoryMealItensRepository.create(
      makeMealItem({ createdAt: new Date(2022, 0, 23) }),
    );

    const result = await sut.execute({
      page: 1,
    });

    expect(result.value?.mealItens).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ]);
  });

  it('should be able to fetch paginated recent meals itens', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryMealItensRepository.create(makeMealItem());
    }

    const result = await sut.execute({
      page: 2,
    });

    expect(result.value?.mealItens).toHaveLength(2);
  });
});
