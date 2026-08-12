import { InMemoryFoodsRepository } from '../../../../test/repositories/in-memory-foods-repository';
import { CreateFoodUseCase } from './create-food';
import { makeFood } from '../../../../test/factories/make-food';
import { FoodAlreadyExistsError } from './errors/food-already-exists-error';

let inMemoryFoodsRepository: InMemoryFoodsRepository;
let sut: CreateFoodUseCase;

describe('Create Food', () => {
  beforeEach(() => {
    inMemoryFoodsRepository = new InMemoryFoodsRepository();
    sut = new CreateFoodUseCase(inMemoryFoodsRepository);
  });

  it('should be able to create an food', async () => {
    const result = await sut.execute({
      name: 'Arroz',
      categoryId: '1',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(inMemoryFoodsRepository.items[0]).toEqual(result.value.food);
    }
  });

  it('should not be able to create a food with an existing name', async () => {
    await inMemoryFoodsRepository.create(makeFood({ name: 'Arroz' }));

    const result = await sut.execute({
      name: 'Arroz',
      categoryId: '1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(FoodAlreadyExistsError);
  });
});
