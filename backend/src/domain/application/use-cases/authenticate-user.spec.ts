import { FakeEncrypter } from '../../../../test/cryptography/fake-encrypter';
import { FakeHasher } from '../../../../test/cryptography/fake-hasher';
import { makeUser } from '../../../../test/factories/make-user';
import { InMemoryUsersRepository } from '../../../../test/repositories/in-memomry-users-repository';
import { AuthenticateUserUseCase } from './authenticate-user';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;

let sut: AuthenticateUserUseCase;

describe('Authentica User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();

    sut = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it('should be able to authenticate a user', async () => {
    const user = makeUser({
      email: 'john@doe.com',
      password: await fakeHasher.hash('123456'),
    });

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      email: 'john@doe.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
