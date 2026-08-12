import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GetCategoryByIdUseCase } from "@/domain/application/use-cases/get-by-id-category";
import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { CategoryPresenter } from "../presenters/category-presenter";


@Controller('/categories/:id')
@ApiTags('Categories')
@ApiBearerAuth('access-token')
export class GetByIdCategoryController {
    constructor(private getCategoryById: GetCategoryByIdUseCase) {}

    @Get()
    async handle(@Param('id') id: string) {
        const result = await this.getCategoryById.execute({id})

        if(result.isLeft()) {
            throw new BadRequestException()
        }

        return { category: CategoryPresenter.toHttp(result.value.category) }
    }
}