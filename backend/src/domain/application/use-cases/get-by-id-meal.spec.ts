import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { GetMealByIdUseCase } from './get-by-id-meal';
import { InMemoryMealsRepository } from '../../../../test/repositories/in-memory-meals-repository';
import { makeMeal } from '../../../../test/factories/make-meal';

let inMemoryMealsRepository: InMemoryMealsRepository;
let sut: GetMealByIdUseCase;

describe('Get By Id Meal', () => {
  beforeEach(() => {
    inMemoryMealsRepository = new InMemoryMealsRepository();
    sut = new GetMealByIdUseCase(inMemoryMealsRepository);
  });

  it('should be able to get a food by id', async () => {
    const newMeal = makeMeal({}, new UniqueEntityID('meal-1'));

    await inMemoryMealsRepository.create(newMeal);

    const result = await sut.execute({
      id: 'meal-1',
    });

    expect(result.value).toMatchObject({
      meal: expect.objectContaining({
        id: newMeal.id,
      }),
    });
  });
});
