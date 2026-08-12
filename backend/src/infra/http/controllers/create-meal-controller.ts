import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateMealUseCase } from '@/domain/application/use-cases/create-meal';
import { TurnsType as PrismaTurnsType } from '@prisma/client';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import { TurnsType } from '@/domain/enterprise/entities/meal';

const createMealBodySchema = z.object({
  date: z.coerce.date(),
  turn: z.enum(PrismaTurnsType),
});

const bodyValidationPipe = new ZodValidationPipe(createMealBodySchema);

type CreateMealBodySchema = z.infer<typeof createMealBodySchema>;

@Controller('/meals')
@ApiTags('Meals')
@ApiBearerAuth('access-token')
export class CreateMealController {
  constructor(private createMeal: CreateMealUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateMealBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { date, turn } = body;

    const userId = user.sub;

    await this.createMeal.execute({
      date,
      turn: turn as TurnsType,
      userId,
    });
  }
}
