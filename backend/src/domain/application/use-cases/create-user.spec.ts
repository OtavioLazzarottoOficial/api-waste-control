import { FakeHasher } from '../../../../test/cryptography/fake-hasher';
import { makeUser } from '../../../../test/factories/make-user';
import { InMemoryUsersRepository } from '../../../../test/repositories/in-memomry-users-repository';
import { CreateUserUseCase } from './create-user';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let sut: CreateUserUseCase;

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    sut = new CreateUserUseCase(inMemoryUsersRepository, fakeHasher);
  });

  it('should be able to create a new user', async () => {
    const newUser = makeUser({ password: '123456' });

    const result = await sut.execute(newUser);

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0],
    });
  });

  it('should hash user password upon registration', async () => {
    const newUser = makeUser({ password: '123456' });

    const result = await sut.execute(newUser);

    const hashedPassword = await fakeHasher.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword);
  });
});
