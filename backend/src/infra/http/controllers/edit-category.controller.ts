import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpCode, Param, Put, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { EditCategoryUseCase } from '@/domain/application/use-cases/edit-category';
import { Public } from '@/infra/auth/public';
import { CategoryAlreadyExistsError } from '@/domain/application/use-cases/errors/category-already-exists-error';
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';

const editCategoryBodySchema = z.object({
  name: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(editCategoryBodySchema);

type EditCategoryBodySchema = z.infer<typeof editCategoryBodySchema>;

@Controller('/categories/:id')
@ApiTags('Categories')
export class EditCategoryController {
  constructor(private editCategory: EditCategoryUseCase) {}

  @Put()
  @HttpCode(204)
  @Public()
  async handle(
    @Body(bodyValidationPipe) body: EditCategoryBodySchema,
    @Param('id') categoryId: string
  ) {
    const { name } = body;

    const result = await this.editCategory.execute({
      name,
      categoryId
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CategoryAlreadyExistsError: {
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
