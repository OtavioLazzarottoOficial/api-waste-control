import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { FetchMealItemsByMealIdUseCase } from '@/domain/application/use-cases/fetch-meal-items-by-meal-id';
import { MealItemPresenter } from '../presenters/mealItem-presenter';

@Controller('/meals/:mealId/items')
@ApiTags('Meal Items')
@ApiBearerAuth('access-token')
export class FetchMealItemsByMealIdController {
  constructor(private fetchMealItemsByMealId: FetchMealItemsByMealIdUseCase) {}

  @Get()
  async handle(@Param('mealId') mealId: string) {
    const result = await this.fetchMealItemsByMealId.execute({ mealId });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const mealItens = result.value.mealItens;

    return { mealItems: mealItens.map(MealItemPresenter.toHttp) };
  }
}
