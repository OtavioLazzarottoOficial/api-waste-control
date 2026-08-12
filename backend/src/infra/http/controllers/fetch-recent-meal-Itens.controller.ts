import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { FetchRecentMealItensUseCase } from '@/domain/application/use-cases/fetch-recent-meal-itens';
import { MealItemPresenter } from '../presenters/mealItem-presenter';

const pageQueryParamSchema = z.coerce.number().min(1).default(1);

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;
@Controller('/mealItems')
@ApiTags('Meal Items')
@ApiBearerAuth('access-token')
export class FetchRecentMealItensController {
  constructor(private fetchRecentMealItens: FetchRecentMealItensUseCase) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchRecentMealItens.execute({ page });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const mealItens = result.value.mealItens;

    return { mealItens: mealItens.map(MealItemPresenter.toHttp) };
  }
}
