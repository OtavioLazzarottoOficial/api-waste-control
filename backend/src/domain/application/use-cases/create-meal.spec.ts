import { TurnsType } from '@/domain/enterprise/entities/meal';
import { InMemoryMealsRepository } from '../../../../test/repositories/in-memory-meals-repository';
import { CreateMealUseCase } from './create-meal';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryMealsRepository: InMemoryMealsRepository;
let sut: CreateMealUseCase;

describe('Create Meal', () => {
  beforeEach(() => {
    inMemoryMealsRepository = new InMemoryMealsRepository();
    sut = new CreateMealUseCase(inMemoryMealsRepository);
  });

  it('should be able to create an meal', async () => {
    const result = await sut.execute({
      date: new Date(),
      turn: TurnsType.DINNER,
      userId: 'meal-1',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryMealsRepository.items[0]).toEqual(result.value?.meal);
  });
});
