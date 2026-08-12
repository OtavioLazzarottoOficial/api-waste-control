import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import {
  PdfGenerator,
  GeneratePdfOptions,
} from '@/domain/application/services/pdf-generator';
import { WasteWithDetails } from '@/domain/enterprise/entities/value-objects/waste-with-details';

@Injectable()
export class PdfKitGenerator implements PdfGenerator {
  async generateWasteReport(
    wastes: WasteWithDetails[],
    options: GeneratePdfOptions,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          margin: 50,
          size: 'A4',
          bufferPages: true,
        });
        const buffers: Buffer[] = [];

        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => {
          resolve(Buffer.concat(buffers));
        });
        doc.on('error', (err) => {
          reject(err);
        });

        // 1. Título Principal
        doc
          .fillColor('#111827')
          .fontSize(22)
          .font('Helvetica-Bold')
          .text('Relatório de Desperdício', { align: 'center' });
        doc.moveDown();

        // 2. Período e data de geração
        const startDateStr = options.startDate.toLocaleDateString('pt-BR');
        const endDateStr = options.endDate.toLocaleDateString('pt-BR');
        const genDateStr = new Date().toLocaleString('pt-BR');

        doc
          .fillColor('#4b5563')
          .fontSize(10)
          .font('Helvetica')
          .text(`Período: ${startDateStr} a ${endDateStr}`);
        doc.text(`Gerado em: ${genDateStr}`);
        doc.moveDown();

        // Linha divisória
        doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown();

        // 3. Estatísticas Consolidadas
        const totalWasted = wastes.reduce((acc, curr) => acc + curr.quantity, 0);
        const avgWasted = wastes.length > 0 ? (totalWasted / wastes.length).toFixed(1) : '0';

        // Calcular maior motivo
        const reasonCounts: Record<string, number> = {};
        wastes.forEach((w) => {
          const reasonLabel = this.getReasonLabel(w.reason);
          reasonCounts[reasonLabel] = (reasonCounts[reasonLabel] || 0) + w.quantity;
        });
        let majorReason = 'Nenhum';
        let maxReasonQty = 0;
        Object.entries(reasonCounts).forEach(([reason, qty]) => {
          if (qty > maxReasonQty) {
            maxReasonQty = qty;
            majorReason = reason;
          }
        });

        doc.fillColor('#111827').fontSize(14).font('Helvetica-Bold').text('Resumo do Período');
        doc.moveDown(0.5);
        doc.fillColor('#1f2937').fontSize(10).font('Helvetica');
        doc.text(`• Total Desperdiçado: ${totalWasted}g`);
        doc.text(`• Média por Registro: ${avgWasted}g`);
        doc.text(`• Maior Motivo de Perda: ${majorReason}`);
        doc.moveDown();

        // Linha divisória
        doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown();

        // 4. Listagem de Registros
        doc.fillColor('#111827').fontSize(14).font('Helvetica-Bold').text('Registros Detalhados');
        doc.moveDown(0.5);

        if (wastes.length === 0) {
          doc.fillColor('#9ca3af').fontSize(10).font('Helvetica-Oblique').text('Nenhum desperdício registrado no período.');
        } else {
          wastes.forEach((waste) => {
            const dateStr = waste.mealDate.toLocaleDateString('pt-BR');
            const turnStr = this.getTurnLabel(waste.mealTurn);
            const reasonStr = this.getReasonLabel(waste.reason);

            doc.fillColor('#111827').fontSize(10).font('Helvetica-Bold');
            doc.text(`${dateStr} - ${waste.foodName} (${turnStr})`);

            doc.fillColor('#4b5563').fontSize(9).font('Helvetica');
            doc.text(`  Categoria: ${waste.categoryName}  |  Motivo: ${reasonStr}  |  Quantidade: ${waste.quantity}g`);
            doc.moveDown(0.5);
          });
        }

        // 5. Numeração de páginas no rodapé
        const pages = doc.bufferedPageRange();
        for (let i = pages.start; i < pages.start + pages.count; i++) {
          doc.switchToPage(i);
          doc.fillColor('#9ca3af').fontSize(8).font('Helvetica');
          doc.text(
            `Página ${i + 1} de ${pages.count}  |  Sistema Waste Control`,
            50,
            785,
            { align: 'center', width: 495 },
          );
        }

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  private getReasonLabel(reason: string): string {
    switch (reason) {
      case 'LEFTOVER':
      case 'Sobrou':
        return 'Sobrou';
      case 'ITSPOILED':
      case 'Estragou':
        return 'Estragou';
      case 'ERROR_PREPARATION':
      case 'Erro no Preparo':
        return 'Erro no Preparo';
      default:
        return reason;
    }
  }

  private getTurnLabel(turn: string): string {
    switch (turn) {
      case 'AFTERNOON':
      case 'Almoco':
        return 'Almoço';
      case 'DINNER':
      case 'Janta':
        return 'Jantar';
      default:
        return turn;
    }
  }
}
