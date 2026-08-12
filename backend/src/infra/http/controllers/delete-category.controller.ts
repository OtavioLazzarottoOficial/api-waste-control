import { ApiTags } from '@nestjs/swagger';
import { DeleteCategoryUseCase } from '@/domain/application/use-cases/delete-category';
import { Public } from '@/infra/auth/public';
import { Controller, Delete, HttpCode, Param } from '@nestjs/common';

@Controller('/categories/:categoryId')
@ApiTags('Categories')
export class DeleteCategoryController {
  constructor(private deleteCategory: DeleteCategoryUseCase) {}

  @Delete()
  @Public()
  @HttpCode(204)
  async handle(@Param('categoryId') categoryId: string) {
    await this.deleteCategory.execute({ categoryId });
  }
}
