import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeFood } from '../../../../test/factories/make-food';
import { InMemoryFoodsRepository } from '../../../../test/repositories/in-memory-foods-repository';
import { EditFoodUseCase } from './edit-food';
import { FoodAlreadyExistsError } from './errors/food-already-exists-error';

let inMemoryFoodsRepository: InMemoryFoodsRepository;
let sut: EditFoodUseCase;

describe('Edit Food', () => {
  beforeEach(() => {
    inMemoryFoodsRepository = new InMemoryFoodsRepository();
    sut = new EditFoodUseCase(inMemoryFoodsRepository);
  });

  it('should be able to edit a food', async () => {
    const newFood = makeFood({ name: 'food1' }, new UniqueEntityID('food-1'));

    await inMemoryFoodsRepository.create(newFood);

    await sut.execute({
      foodId: newFood.id.toValue(),
      name: 'food-name-2',
      categoryId: 'category-2',
    });

    expect(inMemoryFoodsRepository.items[0]).toMatchObject({
      name: 'food-name-2',
      categoryId: new UniqueEntityID('category-2'),
    });
  });

  it('should not be able to edit a food to an existing name', async () => {
    const food1 = makeFood({ name: 'Arroz' }, new UniqueEntityID('food-1'));
    const food2 = makeFood({ name: 'Feijão' }, new UniqueEntityID('food-2'));

    await inMemoryFoodsRepository.create(food1);
    await inMemoryFoodsRepository.create(food2);

    const result = await sut.execute({
      foodId: 'food-2',
      name: 'Arroz',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(FoodAlreadyExistsError);
  });
});
