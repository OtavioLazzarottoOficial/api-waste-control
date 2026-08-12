import { InMemoryFoodsRepository } from '../../../../test/repositories/in-memory-foods-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeFood } from '../../../../test/factories/make-food';
import { DeleteFoodUseCase } from './delete-food';

let inMemoryFoodsRepository: InMemoryFoodsRepository;
let sut: DeleteFoodUseCase;

describe('Delete Food', () => {
  beforeEach(() => {
    inMemoryFoodsRepository = new InMemoryFoodsRepository();
    sut = new DeleteFoodUseCase(inMemoryFoodsRepository);
  });

  it('should be able to delete a food', async () => {
    const newFood = makeFood({}, new UniqueEntityID('food-1'));

    await inMemoryFoodsRepository.create(newFood);

    await sut.execute({
      foodId: 'food-1',
    });

    expect(inMemoryFoodsRepository.items).toHaveLength(0);
  });
});
