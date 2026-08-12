import { ApiTags } from '@nestjs/swagger';
import { FetchRecentMealsUseCase } from '@/domain/application/use-cases/fetch-recent-meals';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { MealPresenter } from '../presenters/meal-presenter';
import { Public } from '@/infra/auth/public';

const pageQueryParamSchema = z.coerce.number().min(1).default(1);

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;
@Controller('/meals')
@ApiTags('Meals')
export class FetchRecentMealsController {
  constructor(private fetchRecentMeals: FetchRecentMealsUseCase) {}

  @Get()
  @Public()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchRecentMeals.execute({ page });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const meals = result.value.meals;

    return { meals: meals.map(MealPresenter.toHttp) };
  }
}
