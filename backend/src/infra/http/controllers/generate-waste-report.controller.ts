import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Res,
  ForbiddenException,
} from '@nestjs/common';
import type { Response } from 'express';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { GenerateWasteReportUseCase } from '@/domain/application/use-cases/generate-waste-report';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import type { UserPayload } from '@/infra/auth/jwt.strategy';

const generateWasteReportQuerySchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

type GenerateWasteReportQuerySchema = z.infer<
  typeof generateWasteReportQuerySchema
>;

const queryValidationPipe = new ZodValidationPipe(
  generateWasteReportQuerySchema,
);

@Controller('/wastes')
@ApiTags('Wastes')
@ApiBearerAuth('access-token')
export class GenerateWasteReportController {
  constructor(private generateWasteReport: GenerateWasteReportUseCase) {}

  @Get('/report')
  async handle(
    @Query(queryValidationPipe) query: GenerateWasteReportQuerySchema,
    @Res() res: Response,
    @CurrentUser() user: UserPayload,
  ) {
    if (user.role !== 'ADMIN' && user.roles !== 'ADMIN') {
      throw new ForbiddenException('Apenas administradores podem gerar relatórios.');
    }

    const { startDate, endDate } = query;

    const result = await this.generateWasteReport.execute({
      startDate,
      endDate,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }

    const { pdf } = result.value;

    const formattedStart = startDate.toISOString().split('T')[0];
    const formattedEnd = endDate.toISOString().split('T')[0];

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="relatorio-desperdicio-${formattedStart}-a-${formattedEnd}.pdf"`,
    );

    res.send(pdf);
  }
}
