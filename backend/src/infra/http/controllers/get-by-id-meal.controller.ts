import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GetMealByIdUseCase } from "@/domain/application/use-cases/get-by-id-meal";
import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { MealPresenter } from "../presenters/meal-presenter";


@Controller('/meals/:id')
@ApiTags('Meals')
@ApiBearerAuth('access-token')
export class GetByIdMealController {
    constructor(private getMealById: GetMealByIdUseCase) {}

    @Get()
    async handle(@Param('id') id: string) {
        const result = await this.getMealById.execute({id})

        if(result.isLeft()) {
            throw new BadRequestException()
        }

        return { meal: MealPresenter.toHttp(result.value.meal) }
    }
}