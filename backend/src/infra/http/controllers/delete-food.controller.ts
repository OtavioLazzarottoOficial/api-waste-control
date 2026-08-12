import { ApiTags } from '@nestjs/swagger';
import { DeleteFoodUseCase } from "@/domain/application/use-cases/delete-food";
import { Public } from "@/infra/auth/public";
import { Controller, Delete, HttpCode, Param } from "@nestjs/common";


@Controller('/foods/:foodId')
@ApiTags('Foods')
export class DeleteFoodController {
  constructor(private deleteFood: DeleteFoodUseCase) {}

  @Delete()
  @HttpCode(204)
  @Public()
  async handle(@Param('foodId') foodId: string) {
    await this.deleteFood.execute({ foodId });
  }
}
