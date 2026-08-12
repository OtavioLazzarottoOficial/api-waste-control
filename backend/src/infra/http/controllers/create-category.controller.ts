import { ApiTags } from '@nestjs/swagger';
import { CreateCategoryUseCase } from '@/domain/application/use-cases/create-category';
import { Body, Controller, Post, ConflictException, BadRequestException } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { Public } from '@/infra/auth/public';
import { CategoryAlreadyExistsError } from '@/domain/application/use-cases/errors/category-already-exists-error';

const createCategoryBodySchema = z.object({
  name: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(createCategoryBodySchema);

type CreateCategoryBodySchema = z.infer<typeof createCategoryBodySchema>;

@Controller('/categories')
@ApiTags('Categories')
export class CreateCategoryController {
  constructor(private createCategory: CreateCategoryUseCase) {}

  @Post()
  @Public()
  async handle(@Body(bodyValidationPipe) body: CreateCategoryBodySchema) {
    const { name } = body;

    const result = await this.createCategory.execute({
      name,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CategoryAlreadyExistsError: {
          throw new ConflictException(error.message);
        }

        default: {
          throw new BadRequestException(error.message);
        }
      }
    }
  }
}
