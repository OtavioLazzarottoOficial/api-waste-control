import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { GetFoodByIdUseCase } from "@/domain/application/use-cases/get-by-id-food";
import { FoodPresenter } from "../presenters/food-presenter";


@Controller('/foods/:id')
@ApiTags('Foods')
@ApiBearerAuth('access-token')
export class GetByIdFoodController {
    constructor(private getFoodById: GetFoodByIdUseCase) {}

    @Get()
    async handle(@Param('id') id: string) {
        const result = await this.getFoodById.execute({id})

        if(result.isLeft()) {
            throw new BadRequestException()
        }

        return { food: FoodPresenter.toHttp(result.value.food) }
    }
}