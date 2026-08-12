import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DeleteWasteUseCase } from "@/domain/application/use-cases/delete-waste";
import { Controller, Delete, HttpCode, Param } from "@nestjs/common";


@Controller('/wastes/:wasteId')
@ApiTags('Wastes')
@ApiBearerAuth('access-token')
export class DeleteWasteController {
  constructor(private deleteWaste: DeleteWasteUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('wasteId') wasteId: string) {
    await this.deleteWaste.execute({ wasteId });
  }
}
