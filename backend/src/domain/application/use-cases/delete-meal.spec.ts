import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryMealsRepository } from '../../../../test/repositories/in-memory-meals-repository';
import { DeleteMealUseCase } from './delete-meal';
import { makeMeal } from '../../../../test/factories/make-meal';

let inMemoryMealsRepository: InMemoryMealsRepository;
let sut: DeleteMealUseCase;

describe('Delete Meal', () => {
  beforeEach(() => {
    inMemoryMealsRepository = new InMemoryMealsRepository();
    sut = new DeleteMealUseCase(inMemoryMealsRepository);
  });

  it('should be able to delete a food', async () => {
    const newMeal = makeMeal({}, new UniqueEntityID('meal-1'));

    await inMemoryMealsRepository.create(newMeal);

    await sut.execute({
      mealId: 'meal-1',
    });

    expect(inMemoryMealsRepository.items).toHaveLength(0);
  });
});
