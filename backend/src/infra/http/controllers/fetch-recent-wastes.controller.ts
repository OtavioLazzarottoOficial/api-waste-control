import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { FetchRecentWastesUseCase } from '@/domain/application/use-cases/fetch-recent-wastes';
import { WastePresenter } from '../presenters/waste-presenter';

const pageQueryParamSchema = z.coerce.number().min(1).default(1);

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;
@Controller('/wastes')
@ApiTags('Wastes')
@ApiBearerAuth('access-token')
export class FetchRecentWastesController {
  constructor(private fetchRecentWastes: FetchRecentWastesUseCase) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchRecentWastes.execute({ page });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const wastes = result.value.wastes;

    return { wastes: wastes.map(WastePresenter.toHttp) };
  }
}
