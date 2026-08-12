import { Injectable } from '@nestjs/common';
import { Either, right, left } from '@/core/either';
import { WastesRepository } from '../repositories/wastes-repository';
import { PdfGenerator } from '../services/pdf-generator';
import { InvalidDatesError } from './errors/invalid-dates-error';

interface GenerateWasteReportUseCaseRequest {
  startDate: Date;
  endDate: Date;
}

type GenerateWasteReportUseCaseResponse = Either<
  InvalidDatesError,
  {
    pdf: Buffer;
  }
>;

@Injectable()
export class GenerateWasteReportUseCase {
  constructor(
    private wastesRepository: WastesRepository,
    private pdfGenerator: PdfGenerator,
  ) {}

  async execute({
    startDate,
    endDate,
  }: GenerateWasteReportUseCaseRequest): Promise<GenerateWasteReportUseCaseResponse> {
    if (startDate > endDate) {
      return left(new InvalidDatesError());
    }

    const wastes = await this.wastesRepository.findManyWithDetailsByDateRange(
      startDate,
      endDate,
    );

    const pdf = await this.pdfGenerator.generateWasteReport(wastes, {
      startDate,
      endDate,
    });

    return right({
      pdf,
    });
  }
}
