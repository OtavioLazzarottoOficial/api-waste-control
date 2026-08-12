import { GenerateWasteReportUseCase } from './generate-waste-report';
import { InMemoryWastesRepository } from '../../../../test/repositories/in-memory-wastes-repository';
import { InMemoryMealItensRepository } from '../../../../test/repositories/in-memory-meal-itens-repository';
import { InMemoryFoodsRepository } from '../../../../test/repositories/in-memory-foods-repository';
import { InMemoryCategoriesRepository } from '../../../../test/repositories/in-memory-categories-repository';
import { InMemoryMealsRepository } from '../../../../test/repositories/in-memory-meals-repository';
import { makeWaste } from '../../../../test/factories/make-waste';
import { makeMealItem } from '../../../../test/factories/make-meal-item';
import { makeFood } from '../../../../test/factories/make-food';
import { makeCategory } from '../../../../test/factories/make-category';
import { makeMeal } from '../../../../test/factories/make-meal';
import { InvalidDatesError } from './errors/invalid-dates-error';
import { vi } from 'vitest';

let inMemoryWastesRepository: InMemoryWastesRepository;
let inMemoryMealItensRepository: InMemoryMealItensRepository;
let inMemoryFoodsRepository: InMemoryFoodsRepository;
let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let inMemoryMealsRepository: InMemoryMealsRepository;

const fakePdfGenerator = {
  generateWasteReport: vi.fn().mockResolvedValue(Buffer.from('fake-pdf-content')),
};

let sut: GenerateWasteReportUseCase;

describe('Generate Waste Report Use Case', () => {
  beforeEach(() => {
    inMemoryMealItensRepository = new InMemoryMealItensRepository();
    inMemoryFoodsRepository = new InMemoryFoodsRepository();
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository();
    inMemoryMealsRepository = new InMemoryMealsRepository();

    inMemoryWastesRepository = new InMemoryWastesRepository(
      inMemoryMealItensRepository,
      inMemoryFoodsRepository,
      inMemoryCategoriesRepository,
      inMemoryMealsRepository,
    );

    sut = new GenerateWasteReportUseCase(
      inMemoryWastesRepository,
      fakePdfGenerator,
    );
  });

  test('should generate a waste report PDF successfully', async () => {
    const category = makeCategory({ name: 'Carboidratos' });
    inMemoryCategoriesRepository.items.push(category);

    const food = makeFood({ name: 'Arroz', categoryId: category.id });
    inMemoryFoodsRepository.items.push(food);

    const meal = makeMeal({ date: new Date('2026-06-01') });
    inMemoryMealsRepository.items.push(meal);

    const mealItem = makeMealItem({
      foodId: food.id,
      mealId: meal.id,
      quantityServed: 100,
      quantityConsumed: 80,
    });
    inMemoryMealItensRepository.items.push(mealItem);

    const waste = makeWaste({
      mealItemId: mealItem.id,
      quantity: 20,
      createdAt: new Date('2026-06-02'),
    });
    inMemoryWastesRepository.items.push(waste);

    const result = await sut.execute({
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-06-03'),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      pdf: Buffer.from('fake-pdf-content'),
    });
    expect(fakePdfGenerator.generateWasteReport).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          props: expect.objectContaining({
            foodName: 'Arroz',
            categoryName: 'Carboidratos',
            quantity: 20,
          }),
        }),
      ]),
      {
        startDate: new Date('2026-06-01'),
        endDate: new Date('2026-06-03'),
      },
    );
  });

  test('should return an error if start date is after end date', async () => {
    const result = await sut.execute({
      startDate: new Date('2026-06-05'),
      endDate: new Date('2026-06-03'),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidDatesError);
  });
});
