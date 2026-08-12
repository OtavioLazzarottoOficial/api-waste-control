import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TurnsType as PrismaTurnsType } from '@prisma/client';
import { BadRequestException, Body, Controller, HttpCode, Param, Post, Put } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { TurnsType } from '@/domain/enterprise/entities/meal';
import { EditMealUseCase } from '@/domain/application/use-cases/edit-meal';

const editMealBodySchema = z.object({
  date: z.coerce.date().optional(),
  turn: z.enum(PrismaTurnsType).optional(),
});

const bodyValidationPipe = new ZodValidationPipe(editMealBodySchema);

type EditMealBodySchema = z.infer<typeof editMealBodySchema>;

@Controller('/meals/:id')
@ApiTags('Meals')
@ApiBearerAuth('access-token')
export class EditMealController {
  constructor(private editMeal: EditMealUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditMealBodySchema,
    @Param('id') mealId: string,
  ) {
    const { date, turn } = body;

    const result = await this.editMeal.execute({
      date,
      turn: turn as TurnsType,
      mealId,
    });

    if(result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
