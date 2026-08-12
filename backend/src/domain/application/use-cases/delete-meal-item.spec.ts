import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DeleteMealItemUseCase } from './delete-meal-item';
import { InMemoryMealItensRepository } from '../../../../test/repositories/in-memory-meal-itens-repository';
import { makeMealItem } from '../../../../test/factories/make-meal-item';


let inMemoryMealItensRepository: InMemoryMealItensRepository;
let sut: DeleteMealItemUseCase;

describe('Delete Meal Item', () => {
  beforeEach(() => {
    inMemoryMealItensRepository = new InMemoryMealItensRepository();
    sut = new DeleteMealItemUseCase(inMemoryMealItensRepository);
  });

  it('should be able to delete a meal item', async () => {
    const newMealItem = makeMealItem({}, new UniqueEntityID('mealItem-1'));

    await inMemoryMealItensRepository.create(newMealItem);

    await sut.execute({
      mealItemId: 'mealItem-1',
    });

    expect(inMemoryMealItensRepository.items).toHaveLength(0);
  });
});
