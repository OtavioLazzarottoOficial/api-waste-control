import { WasteWithDetails } from '@/domain/enterprise/entities/value-objects/waste-with-details';

export interface GeneratePdfOptions {
  startDate: Date;
  endDate: Date;
}

export abstract class PdfGenerator {
  abstract generateWasteReport(
    wastes: WasteWithDetails[],
    options: GeneratePdfOptions,
  ): Promise<Buffer>;
}
