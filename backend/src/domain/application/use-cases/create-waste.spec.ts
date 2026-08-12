import { ReasonType } from '@/domain/enterprise/entities/waste';
import { InMemoryWastesRepository } from '../../../../test/repositories/in-memory-wastes-repository';
import { CreateWasteUseCase } from './create-waste';

let inMemoryWastesRepository: InMemoryWastesRepository;
let sut: CreateWasteUseCase;

describe('Create Waste', () => {
  beforeEach(() => {
    inMemoryWastesRepository = new InMemoryWastesRepository();
    sut = new CreateWasteUseCase(inMemoryWastesRepository);
  });

  it('should be able to create an waste', async () => {
    const result = await sut.execute({
      mealItemId: '1',
      quantity: 10,
      reason: ReasonType.LEFTOVER,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryWastesRepository.items[0]).toEqual(result.value?.waste);
  });
});
