import { ApiTags } from '@nestjs/swagger';
import {
  BadGatewayException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { CreateUserUseCase } from '@/domain/application/use-cases/create-user';
import { Roles } from '@/domain/enterprise/entities/user';
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user-already-exists-error';
import { Public } from '@/infra/auth/public';

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
  roles: z.enum(Roles),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller('/accounts')
@Public()
@ApiTags('Authentication')
export class CreateAccountController {
  constructor(private createUser: CreateUserUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password, roles } = body;

    const result = await this.createUser.execute({
      name,
      email,
      password,
      roles,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserAlreadyExistsError: {
          throw new ConflictException(error.message);
        }

        default: {
          throw new BadGatewayException(error.message);
        }
      }
    }
  }
}
