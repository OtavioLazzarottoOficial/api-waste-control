import { useMutation } from "@tanstack/react-query";
import { api } from "../helpers/api";
import { notifyError, notifySuccess } from "../helpers/notifications";

interface ReportParams {
  startDate: string;
  endDate: string;
}

async function generateWasteReport({ startDate, endDate }: ReportParams): Promise<Blob> {
  const response = await api.get("/wastes/report", {
    params: { startDate, endDate },
    responseType: "blob",
  });
  return response.data;
}

export function useGenerateWasteReport() {
  return useMutation({
    mutationFn: generateWasteReport,
    onSuccess: (blob, variables) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `relatorio-desperdicio-${variables.startDate}-a-${variables.endDate}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      notifySuccess("Relatório gerado com sucesso.");
    },
    onError: (error) => {
      console.error(error);
      notifyError("Erro ao gerar relatório. Tente novamente.");
    },
  });
}
