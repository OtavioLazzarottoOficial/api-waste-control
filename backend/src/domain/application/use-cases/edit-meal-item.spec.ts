import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeMealItem } from '../../../../test/factories/make-meal-item';
import { InMemoryMealItensRepository } from '../../../../test/repositories/in-memory-meal-itens-repository';
import { EditMealItemUseCase } from './edit-meal-item';

let inMemoryMealItensRepository: InMemoryMealItensRepository;
let sut: EditMealItemUseCase;

describe('Edit Meal item', () => {
  beforeEach(() => {
    inMemoryMealItensRepository = new InMemoryMealItensRepository();
    sut = new EditMealItemUseCase(inMemoryMealItensRepository);
  });

  it('should be able to edit a meal item', async () => {
    const newMealItem = makeMealItem({}, new UniqueEntityID('mealItem-1'));
    
    await inMemoryMealItensRepository.create(newMealItem);

    await sut.execute({
      mealItemId: newMealItem.id.toValue(),
      mealId: 'meal-2',
      foodId: 'food-2',
      quantityConsumed: 110,
      quantityServed: 200,
    });

    expect(inMemoryMealItensRepository.items[0]).toMatchObject({
      mealId: new UniqueEntityID('meal-2'),
      foodId: new UniqueEntityID('food-2'),
      quantityConsumed: 110,
      quantityServed: 200,
    });
  });
});
