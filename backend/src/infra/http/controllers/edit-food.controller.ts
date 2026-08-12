import { ApiTags } from '@nestjs/swagger';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { EditFoodUseCase } from '@/domain/application/use-cases/edit-food';
import { Controller, Body, Param, BadRequestException, Put, HttpCode, ConflictException, NotFoundException } from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import { FoodAlreadyExistsError } from '@/domain/application/use-cases/errors/food-already-exists-error';
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';

const editFoodBodySchema = z.object({
  name: z.string().optional(),
  categoryId: z.uuid().optional(),
});

const bodyValidationPipe = new ZodValidationPipe(editFoodBodySchema);

type EditFoodbodySchema = z.infer<typeof editFoodBodySchema>;

@Controller('/foods/:id')
@ApiTags('Foods')
export class EditFoodController {
  constructor(private foodFood: EditFoodUseCase) {}

  @Put()
  @HttpCode(204)
  @Public()
  async handle(@Body(bodyValidationPipe) body: EditFoodbodySchema,
  @Param('id') foodId: string
) {
    const { name, categoryId } = body;

    const result = await this.foodFood.execute({
      name,
      categoryId,
      foodId
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case FoodAlreadyExistsError: {
          throw new ConflictException(error.message);
        }

        case ResourceNotFoundError: {
          throw new NotFoundException(error.message);
        }

        default: {
          throw new BadRequestException(error.message);
        }
      }
    }
  }
}
