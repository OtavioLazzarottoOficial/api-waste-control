import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DeleteMealUseCase } from "@/domain/application/use-cases/delete-meal";
import { Controller, Delete, HttpCode, Param } from "@nestjs/common";


@Controller('/meals/:mealId')
@ApiTags('Meals')
@ApiBearerAuth('access-token')
export class DeleteMealController {
  constructor(private deleteMeal: DeleteMealUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('mealId') mealId: string) {
    await this.deleteMeal.execute({ mealId });
  }
}
