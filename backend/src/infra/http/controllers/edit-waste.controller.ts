import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BadRequestException, Body, Controller, HttpCode, Param, Post, Put } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { ReasonType as PrismaReasonType } from "@prisma/client";
import { ReasonType } from "@/domain/enterprise/entities/waste";
import { EditWasteUseCase } from "@/domain/application/use-cases/edit-waste";


const editWasteBodySchema = z.object({
    mealItemId: z.uuid().optional(),
    quantity: z.number().optional(),
    reason: z.enum(PrismaReasonType).optional(),
})

const BodyValidationPipe = new ZodValidationPipe(editWasteBodySchema)

type EditWasteBodySchema = z.infer<typeof editWasteBodySchema>


@Controller('/wastes/:id')
@ApiTags('Wastes')
@ApiBearerAuth('access-token')
export class EditWasteController {
    constructor(private editWaste: EditWasteUseCase) {}

    @Put()
    @HttpCode(204)
    async handle(
        @Body(BodyValidationPipe) body : EditWasteBodySchema,
        @Param('id') wasteId: string
    ) {
        const 
        {
            mealItemId,
            quantity,
            reason
        } = body

        const result = await this.editWaste.execute({
            wasteId,
            mealItemId,
            quantity,
            reason: reason as unknown as ReasonType
        })

        if(result.isLeft()) {
            throw new BadRequestException()
        }
    }
}