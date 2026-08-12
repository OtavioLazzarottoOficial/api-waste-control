import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GetWasteByIdUseCase } from "@/domain/application/use-cases/get-by-id-waste";
import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { WastePresenter } from "../presenters/waste-presenter";

@Controller('/wastes/:id')
@ApiTags('Wastes')
@ApiBearerAuth('access-token')
export class GetByIdWasteController {
    constructor(private getWasteById: GetWasteByIdUseCase) {}

    @Get()
    async handle(@Param('id') id: string) {
        const result = await this.getWasteById.execute({id})

        if(result.isLeft()) {
            throw new BadRequestException()
        }

        return { waste: WastePresenter.toHttp(result.value.waste) }
    }
}