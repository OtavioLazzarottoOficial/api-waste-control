import { InMemoryFoodsRepository } from '../../../../test/repositories/in-memory-foods-repository';
import { GetFoodByIdUseCase } from './get-by-id-food';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeFood } from '../../../../test/factories/make-food';

let inMemoryFoodsRepository: InMemoryFoodsRepository;
let sut: GetFoodByIdUseCase;

describe('Get By Id Food', () => {
  beforeEach(() => {
    inMemoryFoodsRepository = new InMemoryFoodsRepository();
    sut = new GetFoodByIdUseCase(inMemoryFoodsRepository);
  });

  it('should be able to get a food by id', async () => {
    const newFood = makeFood({}, new UniqueEntityID('food-1'));

    await inMemoryFoodsRepository.create(newFood);

    const result = await sut.execute({
      id: 'food-1',
    });

    expect(result.value).toMatchObject({
      food: expect.objectContaining({
        name: newFood.name,
      }),
    });
  });
});
