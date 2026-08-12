import { makeMealItem } from '../../../../test/factories/make-meal-item';
import { InMemoryMealItensRepository } from '../../../../test/repositories/in-memory-meal-itens-repository';
import { CreateMealItemUseCase } from './create-meal-item';
import { QuantityConsumedLessThanQuantityServedError } from './errors/quantity-consumed-less-than-quantity-consumed';

let inMemoryMealItensRepository: InMemoryMealItensRepository;
let sut: CreateMealItemUseCase;

describe('Create Meal Item', () => {
  beforeEach(() => {
    inMemoryMealItensRepository = new InMemoryMealItensRepository();
    sut = new CreateMealItemUseCase(inMemoryMealItensRepository);
  });

  it('should be able to create an meal item', async () => {
    const newMealItem = makeMealItem();

    const result = await sut.execute({
      mealId: 'meal-1',
      foodId: 'food-1',
      quantityConsumed: 100,
      quantityServed: 200,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(inMemoryMealItensRepository.items[0]).toEqual(
        result.value.mealItem,
      );
    }
  });

  it('should not be able to create an meal item with quantity consumed greater than quantity served', async () => {
    const result = await sut.execute({
      mealId: 'meal-1',
      foodId: 'food-1',
      quantityConsumed: 300,
      quantityServed: 200,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(
      QuantityConsumedLessThanQuantityServedError,
    );
  });
});
