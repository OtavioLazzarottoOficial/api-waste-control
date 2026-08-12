import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryWastesRepository } from "../../../../test/repositories/in-memory-wastes-repository";
import { DeleteWasteUseCase } from "./delete-waste";
import { makeWaste } from "../../../../test/factories/make-waste";

let inMemoryWastesRepository: InMemoryWastesRepository;
let sut: DeleteWasteUseCase;

describe('Delete Waste', () => {
  beforeEach(() => {
    inMemoryWastesRepository = new InMemoryWastesRepository();
    sut = new DeleteWasteUseCase(inMemoryWastesRepository);
  });

  it('should be able to delete a waste', async () => {
    const newWaste = makeWaste({}, new UniqueEntityID('waste-1'));

    await inMemoryWastesRepository.create(newWaste);

    await sut.execute({
      wasteId: 'waste-1',
    });

    expect(inMemoryWastesRepository.items).toHaveLength(0);
  });
});
