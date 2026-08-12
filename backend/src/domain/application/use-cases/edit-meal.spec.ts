import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryMealsRepository } from '../../../../test/repositories/in-memory-meals-repository';
import { makeMeal } from '../../../../test/factories/make-meal';
import { EditMealUseCase } from './edit-meal';
import { TurnsType } from '@/domain/enterprise/entities/meal';

let inMemoryMealsRepository: InMemoryMealsRepository;
let sut: EditMealUseCase;

describe('Edit Meal', () => {
  beforeEach(() => {
    inMemoryMealsRepository = new InMemoryMealsRepository();
    sut = new EditMealUseCase(inMemoryMealsRepository);
  });

  it('should be able to edit a meal', async () => {
    const newMeal = makeMeal({}, new UniqueEntityID('meal-1'));

    await inMemoryMealsRepository.create(newMeal);

    await sut.execute({
      mealId: newMeal.id.toValue(),
      date: new Date('2026-03-09T12:16:31.415Z'),
      turn: TurnsType.AFTERNOON,
    });

    expect(inMemoryMealsRepository.items[0]).toMatchObject({
      date: new Date('2026-03-09T12:16:31.415Z'),
      turn: TurnsType.AFTERNOON,
    });
  });
});
