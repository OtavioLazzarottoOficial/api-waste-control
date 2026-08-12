import { ApiTags } from '@nestjs/swagger';
import { CreateFoodUseCase } from '@/domain/application/use-cases/create-food';
import { Body, Controller, Post, ConflictException, BadRequestException } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { Public } from '@/infra/auth/public';
import { FoodAlreadyExistsError } from '@/domain/application/use-cases/errors/food-already-exists-error';

const createFoodBodySchema = z.object({
  name: z.string(),
  categoryId: z.uuid(),
});

const bodyValidationPipe = new ZodValidationPipe(createFoodBodySchema);

type CreateFoodbodySchema = z.infer<typeof createFoodBodySchema>;

@Controller('/foods')
@ApiTags('Foods')
export class CreateFoodController {
  constructor(private createFood: CreateFoodUseCase) {}

  @Post()
  @Public()
  async handle(@Body(bodyValidationPipe) body: CreateFoodbodySchema) {
    const { name, categoryId } = body;

    const result = await this.createFood.execute({
      name,
      categoryId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case FoodAlreadyExistsError: {
          throw new ConflictException(error.message);
        }

        default: {
          throw new BadRequestException(error.message);
        }
      }
    }
  }
}
