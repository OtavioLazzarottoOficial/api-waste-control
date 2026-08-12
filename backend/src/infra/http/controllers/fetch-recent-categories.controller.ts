import { ApiTags } from '@nestjs/swagger';
import {
  BadGatewayException,
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { FetchRecentCategoriesUseCase } from '@/domain/application/use-cases/fetch-recent-categories';
import { CategoryPresenter } from '../presenters/category-presenter';
import { Public } from '@/infra/auth/public';

const pageQueryParamSchema = z.coerce.number().min(1).default(1);

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/categories')
@Public()
@ApiTags('Categories')
export class FetchRecentCategoriesController {
  constructor(private fetchRecentCategories: FetchRecentCategoriesUseCase) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchRecentCategories.execute({
      page,
    });

    if (result.isLeft()) {
      throw new BadGatewayException();
    }
    
    const categories = result.value.categories;

    return { categories: categories.map(CategoryPresenter.toHttp) };
  }
}
