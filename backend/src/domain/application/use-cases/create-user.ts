import { Roles, User } from '@/domain/enterprise/entities/user';
import { UsersRepository } from '../repositories/users-repository';
import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { HashGenerator } from '../cryptography/hash-generator';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

interface CreateUserUseCaseRequest {
  name: string;
  email: string;
  password: string;
  roles: Roles;
  active?: boolean;
}

type CreateUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User;
  }
>;

@Injectable()
export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) { }

  async execute({
    name,
    email,
    password,
    roles,
    active,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userWithSameEmail =
      await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(email));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      name,
      email,
      password: hashedPassword,
      roles,
      active: false,
    });

    await this.usersRepository.create(user);

    return right({
      user,
    });
  }
}
