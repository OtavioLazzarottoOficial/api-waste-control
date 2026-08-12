import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryWastesRepository } from '../../../../test/repositories/in-memory-wastes-repository';
import { EditWasteUseCase } from './edit-waste';
import { makeWaste } from '../../../../test/factories/make-waste';
import { ReasonType } from '@/domain/enterprise/entities/waste';

let inMemoryWastesRepository: InMemoryWastesRepository;
let sut: EditWasteUseCase;

describe('Edit Waste', () => {
  beforeEach(() => {
    inMemoryWastesRepository = new InMemoryWastesRepository();
    sut = new EditWasteUseCase(inMemoryWastesRepository);
  });

  it('should be able to edit a waste', async () => {
    const newWaste = makeWaste(
      { mealItemId: new UniqueEntityID('meal-item-1'), quantity: 10 },
      new UniqueEntityID('waste-1'),
    );

    await inMemoryWastesRepository.create(newWaste);

    await sut.execute({
      wasteId: newWaste.id.toValue(),
      mealItemId: 'meal-item-2',
      quantity: 20,
      reason: ReasonType.ERROR_PREPARATION,
    });

    expect(inMemoryWastesRepository.items[0]).toMatchObject({
      mealItemId: new UniqueEntityID('meal-item-2'),
      quantity: 20,
      reason: ReasonType.ERROR_PREPARATION,
    });
  });
});
