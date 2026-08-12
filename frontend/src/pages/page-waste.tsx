import { useState, useMemo } from "react";
import { MdOutlineEdit, MdOutlineErrorOutline } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { useFetchWastes } from "../hooks/useFetchWastes";
import { useFetchMeals } from "../hooks/useFetchMeals";
import { useDeleteWaste } from "../hooks/useDeleteWaste";
import { useEditWaste } from "../hooks/useEditWaste";
import type { Waste } from "../models/waste.model";
import { formatDateTime } from "../helpers/convertDate";
import { Button } from "../components/button/button";
import { Input } from "../components/input/input";
import { Select } from "../components/select/select";

function WastePage() {
  const { data: wastes, isLoading } = useFetchWastes();
  const { data: meals } = useFetchMeals();
  const { mutate: deleteWaste } = useDeleteWaste();
  const { mutate: editWaste } = useEditWaste();

  const [editingWasteId, setEditingWasteId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [editReason, setEditReason] = useState<string>("");

  // Filtro por data e paginação
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const handleDeleteWaste = (id: string) => {
    deleteWaste(id);
  };

  const clickEditWaste = (waste: Waste) => {
    setEditingWasteId(waste.id!);
    setEditQuantity(waste.quantity);
    setEditReason(waste.reason);
  };

  const findMealItemDetails = (mealItemId: string) => {
    if (!meals) return null;
    for (const meal of meals) {
      const item = meal.mealItems?.find((i) => i.id === mealItemId);
      if (item) {
        return {
          foodName: item.food?.name || "Alimento",
          mealDate: meal.date,
          mealTurn: meal.turn === "DINNER" ? "Almoço" : "Jantar",
        };
      }
    }
    return null;
  };

  // Filtragem e Paginação de desperdício
  const filteredWastes = useMemo(() => {
    if (!wastes) return [];
    return wastes.filter((waste) => {
      if (!waste.createdAt) return false;
      const wasteDateStr = new Date(waste.createdAt).toISOString().split("T")[0];
      if (startDate && wasteDateStr < startDate) return false;
      if (endDate && wasteDateStr > endDate) return false;
      return true;
    });
  }, [wastes, startDate, endDate]);

  const totalItems = filteredWastes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const paginatedWastes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredWastes.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredWastes, currentPage]);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWasteId) return;
    editWaste({
      id: editingWasteId,
      data: {
        quantity: editQuantity,
        reason: editReason as any,
      },
    });
    setEditingWasteId(null);
  };

  return (
    <div className="flex flex-col px-4 sm:px-12 lg:px-24 pt-10 sm:pt-14">
      <h2 className="text-2xl font-bold mb-6">Registros de Desperdício</h2>

      {/* Filtro por Intervalo de Datas */}
      {wastes && wastes.length > 0 && (
        <div className="w-full bg-white/50 rounded-xl shadow-md p-6 flex flex-col sm:flex-row sm:items-end gap-6 mb-4">
          <div className="flex-1 w-full sm:max-w-xs">
            <Input
              label="Data Inicial"
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex-1 w-full sm:max-w-xs">
            <Input
              label="Data Final"
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          {(startDate || endDate) && (
            <Button
              type="button"
              color="bg-slate-400"
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setCurrentPage(1);
              }}
            >
              Limpar Filtros
            </Button>
          )}
        </div>
      )}

      <div className="w-full bg-white/50 rounded-xl shadow-md">
        <div className="px-8 py-5 border-b border-black/10">
          <p className="text-sm text-gray-600 font-medium">
            Histórico de Desperdício
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <p className="text-gray-400 text-sm">Carregando registros...</p>
          </div>
        ) : !wastes || wastes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-12 bg-white/50 rounded-xl shadow-md">
            <MdOutlineErrorOutline className="w-10 h-10 text-gray-300" />
            <p className="text-gray-400 text-sm">
              Nenhum registro de desperdício encontrado.
            </p>
          </div>
        ) : filteredWastes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-12 bg-white/50 rounded-xl shadow-md">
            <MdOutlineErrorOutline className="w-10 h-10 text-gray-300" />
            <p className="text-gray-400 text-sm">
              Nenhum desperdício correspondente ao intervalo de datas selecionado.
            </p>
          </div>
        ) : (
          <div className="flex flex-col w-full overflow-hidden">
            <ul className="flex flex-col">
            {paginatedWastes.map((waste, index) => {
              const details = findMealItemDetails(waste.mealItemId);
              return (
                <li
                  key={waste.id ?? index}
                  className="flex flex-col sm:flex-row justify-between sm:items-center w-full border-b border-black/10 last:border-b-0 px-4 sm:px-8 py-5 hover:bg-zinc-50 transition-colors gap-4"
                >
                {editingWasteId === waste.id ? (
                  <form onSubmit={handleSaveEdit} className="flex flex-col sm:flex-row sm:items-end gap-4 w-full">
                    <Input
                      label="Quantidade (g)"
                      type="number"
                      value={editQuantity}
                      onChange={(e) => setEditQuantity(Number(e.target.value))}
                    />
                    <Select
                      label="Motivo"
                      value={editReason}
                      options={[
                        { value: "LEFTOVER", label: "Sobrou" },
                        { value: "ITSPOILED", label: "Estragou" },
                        { value: "ERROR_PREPARATION", label: "Erro no Preparo" },
                      ]}
                      onChange={(e) => setEditReason(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button type="submit" color="bg-green-500">
                        Salvar
                      </Button>
                      <Button
                        type="button"
                        color="bg-red-600"
                        onClick={() => setEditingWasteId(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex flex-row items-start gap-4">
                      <MdOutlineErrorOutline className="w-6 h-6 text-orange-600 shrink-0 mt-1" />
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-slate-800">
                          {details?.foodName || "Alimento"}
                        </span>
                        <div className="flex flex-row items-center gap-2">
                          <span className="text-xs font-semibold text-slate-500">Motivo:</span>
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">
                            {waste.reason === "LEFTOVER"
                              ? "Sobrou"
                              : waste.reason === "ITSPOILED"
                                ? "Estragou"
                                : "Erro no Preparo"}
                          </span>
                        </div>
                        {details && (
                          <span className="text-xs text-slate-500 font-medium">
                            Refeição: {new Date(details.mealDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" })} ({details.mealTurn})
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400">
                          Registrado em: {waste.createdAt ? formatDateTime(waste.createdAt) : "—"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-row items-center gap-4 self-end sm:self-auto">
                      <span className="text-sm font-bold text-red-600 mr-2">
                        -{waste.quantity}g
                      </span>
                      <Button
                        type="button"
                        onClick={() => clickEditWaste(waste)}
                      >
                        <MdOutlineEdit />
                      </Button>
                      <Button
                        type="button"
                        color="bg-red-500"
                        onClick={() => handleDeleteWaste(waste.id!)}
                      >
                        <AiOutlineDelete />
                      </Button>
                    </div>
                  </>
                )}
              </li>
              );
            })}
          </ul>

          {/* Controle de Paginação */}
          {totalItems > itemsPerPage && (
            <div className="flex flex-col sm:flex-row justify-between items-center w-full px-8 py-4 bg-slate-50/50 border-t border-black/10 gap-4">
              <span className="text-sm text-gray-500">
                Mostrando {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} a{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} registros
              </span>
              <div className="flex flex-row gap-2 items-center">
                <Button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  color="bg-slate-800"
                  className="!h-9 !py-1 text-sm font-semibold text-white px-4 rounded-lg cursor-pointer"
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-700 font-semibold px-2">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  color="bg-slate-800"
                  className="!h-9 !py-1 text-sm font-semibold text-white px-4 rounded-lg cursor-pointer"
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}

export default WastePage;
