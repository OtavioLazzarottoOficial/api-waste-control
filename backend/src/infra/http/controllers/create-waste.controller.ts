import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { ReasonType as PrismaReasonType } from "@prisma/client";
import { CreateWasteUseCase } from "@/domain/application/use-cases/create-waste";
import { ReasonType } from "@/domain/enterprise/entities/waste";

const createWasteBodySchema = z.object({
  mealItemId: z.string().uuid(),
  quantity: z.number(),
  reason: z.enum(PrismaReasonType),
});

const bodyValidationPipe = new ZodValidationPipe(createWasteBodySchema);

type CreateWasteBodySchema = z.infer<typeof createWasteBodySchema>;

@Controller('/wastes')
@ApiTags('Wastes')
@ApiBearerAuth('access-token')
export class CreateWasteController {
  constructor(private createWaste: CreateWasteUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateWasteBodySchema) {
    const { mealItemId, quantity, reason } = body;

    await this.createWaste.execute({
      mealItemId,
      quantity,
      reason: reason as ReasonType,
    });
  }
}