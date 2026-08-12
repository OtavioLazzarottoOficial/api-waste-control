import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GetMealItemByIdUseCase } from '@/domain/application/use-cases/get-by-id-meal-item';
import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { MealItemPresenter } from '../presenters/mealItem-presenter';

@Controller('/mealItems/:id')
@ApiTags('Meal Items')
@ApiBearerAuth('access-token')
export class GetByIdMealItemController {
  constructor(private getMealItemById: GetMealItemByIdUseCase) {}

  @Get()
  async handle(@Param('id') id: string) {
    const result = await this.getMealItemById.execute({ id });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return { mealItem: MealItemPresenter.toHttp(result.value.mealItem) };
  }
}
