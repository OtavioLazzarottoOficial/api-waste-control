import { useState } from "react";
import Card from "../components/card";
import { useFetchMeals } from "../hooks/useFetchMeals";
import { useFetchWastes } from "../hooks/useFetchWastes";
import { useFetchFoods } from "../hooks/useFetchFoods";
import { Input } from "../components/input/input";
import { Button } from "../components/button/button";
import { useGenerateWasteReport } from "../hooks/useGenerateWasteReport";
import { notifyError } from "../helpers/notifications";
import { useAuth } from "../contexts/auth-context";
import {
  FiCalendar,
  FiDatabase,
  FiTrash2,
  FiActivity,
  FiLayers,
  FiCheckCircle,
  FiTrendingUp,
  FiAlertTriangle,
  FiSun,
  FiMoon,
} from "react-icons/fi";

function Dashboard() {
  const { data: meals } = useFetchMeals();
  const { data: wastes } = useFetchWastes();
  const { data: foods } = useFetchFoods();
  const { mutate: generateReport, isPending: isGenerating } = useGenerateWasteReport();
  const { user } = useAuth();
  const isAdmin = user?.roles === "ADMIN";

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleDownloadReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      notifyError("Por favor, selecione as datas de início e fim.");
      return;
    }
    generateReport({ startDate, endDate });
  };

  // Helper: Encontrar detalhes do item de refeição
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

  // Cálculos de Indicadores
  const totalWasteQuantity = wastes?.reduce((sum, w) => sum + w.quantity, 0) || 0;
  
  const leftoversCount = wastes?.filter(w => w.reason === "LEFTOVER").length || 0;
  const spoiledCount = wastes?.filter(w => w.reason === "ITSPOILED").length || 0;
  const errorPrepCount = wastes?.filter(w => w.reason === "ERROR_PREPARATION").length || 0;

  // 1. Total Servido (Soma de quantityServed de todos os itens de refeição)
  const totalServed = meals?.reduce((sum, m) => {
    return sum + (m.mealItems?.reduce((subSum, item) => subSum + item.quantityServed, 0) || 0);
  }, 0) || 0;

  // 2. Total Consumido (Soma de quantityConsumed de todos os itens de refeição)
  const totalConsumed = meals?.reduce((sum, m) => {
    return sum + (m.mealItems?.reduce((subSum, item) => subSum + item.quantityConsumed, 0) || 0);
  }, 0) || 0;

  // 3. Taxa de Aproveitamento Geral (%)
  const consumptionRate = totalServed > 0 ? Math.round((totalConsumed / totalServed) * 100) : 0;

  // Helper para formatar peso de forma inteligente
  const formatWeight = (grams: number) => {
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(1).replace(".", ",")} kg`;
    }
    return `${grams}g`;
  };

  // 4. Alimento Mais Desperdiçado
  const wastesByFood = (() => {
    if (!wastes) return [];
    const map: Record<string, number> = {};
    wastes.forEach((w) => {
      const details = findMealItemDetails(w.mealItemId);
      const name = details?.foodName || "Desconhecido";
      map[name] = (map[name] || 0) + w.quantity;
    });
    return Object.entries(map)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity);
  })();

  const mostWastedFood = wastesByFood[0];
  const mostWastedFoodName = mostWastedFood?.name || "Nenhum";
  const mostWastedFoodQty = mostWastedFood?.quantity || 0;

  // Top 3 Alimentos com Maior Desperdício
  const topWastedFoods = wastesByFood.slice(0, 3);

  // Últimas Refeições e Aproveitamento (as 4 mais recentes)
  const recentMealsWithRate = (() => {
    if (!meals) return [];
    return [...meals]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4)
      .map((m) => {
        const served = m.mealItems?.reduce((sum, item) => sum + item.quantityServed, 0) || 0;
        const consumed = m.mealItems?.reduce((sum, item) => sum + item.quantityConsumed, 0) || 0;
        const rate = served > 0 ? Math.round((consumed / served) * 100) : 0;
        return {
          ...m,
          served,
          consumed,
          rate,
        };
      });
  })();

  return (
    <div className="flex flex-col px-4 sm:px-12 lg:px-24 pt-10 sm:pt-14 gap-8 pb-16">
      <div>
        <h2 className="text-2xl font-bold mb-6">Visão Geral</h2>
        
        {/* KPIs Grid - 8 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            title="Refeições Registradas"
            value={meals?.length}
            icon={<FiCalendar className="w-5 h-5 text-indigo-500" />}
            color="border-indigo-500"
            description="Total de refeições preparadas"
          />
          <Card
            title="Alimentos Cadastrados"
            value={foods?.length}
            icon={<FiDatabase className="w-5 h-5 text-emerald-500" />}
            color="border-emerald-500"
            description="Total de alimentos no sistema"
          />
          <Card
            title="Casos de Desperdício"
            value={wastes?.length}
            icon={<FiTrash2 className="w-5 h-5 text-amber-500" />}
            color="border-amber-500"
            description="Registros de descarte"
          />
          <Card
            title="Total Desperdiçado"
            value={wastes ? formatWeight(totalWasteQuantity) : undefined}
            icon={<FiActivity className="w-5 h-5 text-rose-500" />}
            color="border-rose-500"
            description="Peso total de sobras/desperdício"
          />
          <Card
            title="Total Servido"
            value={meals ? formatWeight(totalServed) : undefined}
            icon={<FiLayers className="w-5 h-5 text-blue-500" />}
            color="border-blue-500"
            description="Quantidade total preparada/servida"
          />
          <Card
            title="Total Consumido"
            value={meals ? formatWeight(totalConsumed) : undefined}
            icon={<FiCheckCircle className="w-5 h-5 text-cyan-500" />}
            color="border-cyan-500"
            description="Quantidade total consumida"
          />
          <Card
            title="Aproveitamento Geral"
            value={meals ? `${consumptionRate}%` : undefined}
            icon={<FiTrendingUp className="w-5 h-5 text-violet-500" />}
            color="border-violet-500"
            description="Percentual de consumo vs servido"
          />
          <Card
            title="Alimento Mais Desperdiçado"
            value={mostWastedFoodName}
            icon={<FiAlertTriangle className="w-5 h-5 text-red-500" />}
            color="border-red-500"
            description={mostWastedFoodQty > 0 ? `Total desperdiçado: ${formatWeight(mostWastedFoodQty)}` : "Nenhum desperdício registrado"}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-stretch">
        {/* Motivos de Desperdício Card */}
        <div className="bg-white/50 rounded-xl shadow-md p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-2">Distribuição de Descarte</h3>
            <p className="text-sm text-gray-500 mb-6">
              Principais motivos declarados nos registros de desperdício.
            </p>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-700">Sobras (Refeição)</span>
                  <span className="font-bold text-gray-500">{leftoversCount} registros</span>
                </div>
                <div className="w-full bg-black/5 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-2 rounded-full" 
                    style={{ width: `${wastes && wastes.length > 0 ? (leftoversCount / wastes.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-700">Estragado</span>
                  <span className="font-bold text-gray-500">{spoiledCount} registros</span>
                </div>
                <div className="w-full bg-black/5 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-rose-500 h-2 rounded-full" 
                    style={{ width: `${wastes && wastes.length > 0 ? (spoiledCount / wastes.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-700">Erro de Preparo</span>
                  <span className="font-bold text-gray-500">{errorPrepCount} registros</span>
                </div>
                <div className="w-full bg-black/5 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full" 
                    style={{ width: `${wastes && wastes.length > 0 ? (errorPrepCount / wastes.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Alimentos Desperdiçados Card */}
        <div className="bg-white/50 rounded-xl shadow-md p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-2">Top Alimentos Desperdiçados</h3>
            <p className="text-sm text-gray-500 mb-6">
              Alimentos com maior peso acumulado de desperdício registrado.
            </p>
            
            <div className="flex flex-col gap-4">
              {topWastedFoods.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-gray-400 gap-1">
                  <FiAlertTriangle className="w-8 h-8 text-gray-300" />
                  <p className="text-sm">Nenhum desperdício registrado.</p>
                </div>
              ) : (
                topWastedFoods.map((item, index) => {
                  const pct = totalWasteQuantity > 0 ? Math.round((item.quantity / totalWasteQuantity) * 100) : 0;
                  const barColors = ["bg-red-500", "bg-orange-500", "bg-amber-500"];
                  const colorClass = barColors[index] || "bg-gray-500";
                  return (
                    <div key={item.name} className="flex flex-col gap-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-gray-700">{item.name}</span>
                        <span className="font-bold text-gray-500">{formatWeight(item.quantity)} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-black/5 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`${colorClass} h-2 rounded-full`} 
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Últimas Refeições e Aproveitamento Card */}
        <div className={`bg-white/50 rounded-xl shadow-md p-6 flex flex-col justify-between ${!isAdmin ? "lg:col-span-2" : ""}`}>
          <div>
            <h3 className="text-lg font-bold mb-2">Últimas Refeições e Aproveitamento</h3>
            <p className="text-sm text-gray-500 mb-6">
              Taxa de consumo (aproveitamento) das refeições preparadas mais recentemente.
            </p>
            
            <div className="flex flex-col gap-4">
              {recentMealsWithRate.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-gray-400 gap-1">
                  <FiCalendar className="w-8 h-8 text-gray-300" />
                  <p className="text-sm">Nenhuma refeição registrada.</p>
                </div>
              ) : (
                recentMealsWithRate.map((meal) => {
                  let rateColorClass = "bg-red-500";
                  let rateTextColorClass = "text-red-700 bg-red-50 border-red-100";
                  if (meal.rate >= 85) {
                    rateColorClass = "bg-green-500";
                    rateTextColorClass = "text-green-700 bg-green-50 border-green-100";
                  } else if (meal.rate >= 70) {
                    rateColorClass = "bg-amber-500";
                    rateTextColorClass = "text-amber-700 bg-amber-50 border-amber-100";
                  }

                  const weekday = new Date(meal.date).toLocaleDateString("pt-BR", { weekday: "long", timeZone: "UTC" });
                  const formattedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
                  const formattedDate = new Date(meal.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    timeZone: "UTC",
                  });

                  return (
                    <div
                      key={meal.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 pb-3 last:border-b-0 last:pb-0"
                    >
                      {/* Lado esquerdo: Informação da data/turno */}
                      <div className="flex flex-row items-center gap-3">
                        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50 border border-slate-200 rounded-lg px-2 py-1 min-w-[3.5rem] text-center shadow-sm">
                          <span className="text-lg font-extrabold text-slate-800 leading-none">
                            {new Date(meal.date).toLocaleDateString("pt-BR", { day: "2-digit", timeZone: "UTC" })}
                          </span>
                          <span className="text-[8px] font-bold text-indigo-600 uppercase tracking-widest mt-0.5">
                            {new Date(meal.date)
                              .toLocaleDateString("pt-BR", { month: "short", timeZone: "UTC" })
                              .replace(".", "")}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800">
                            {formattedDate}
                          </span>
                          <div className="flex flex-row items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-slate-500 font-medium">
                              {formattedWeekday}
                            </span>
                            <span className="text-[10px] text-slate-300">•</span>
                            {meal.turn === "DINNER" ? (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded font-medium">
                                <FiSun className="w-2.5 h-2.5" />
                                Almoço
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-sky-50 text-sky-800 px-1.5 py-0.2 rounded font-medium">
                                <FiMoon className="w-2.5 h-2.5" />
                                Jantar
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Lado direito: Barra de aproveitamento */}
                      <div className="flex-1 max-w-xs flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-medium">Aproveitamento</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${rateTextColorClass}`}>
                            {meal.rate}%
                          </span>
                        </div>
                        <div className="w-full bg-black/5 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`${rateColorClass} h-2 rounded-full`} 
                            style={{ width: `${meal.rate}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Consumido: {formatWeight(meal.consumed)}</span>
                          <span>Servido: {formatWeight(meal.served)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Relatório Card */}
        {isAdmin && (
          <div className="bg-white/50 rounded-xl shadow-md p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold mb-2">Relatório de Desperdício</h3>
              <p className="text-sm text-gray-500 mb-6">
                Selecione o intervalo de datas para gerar e baixar o relatório consolidado em PDF.
              </p>
            </div>
            <form onSubmit={handleDownloadReport} className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  label="Data Inicial"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  label="Data Final"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isGenerating} isLoading={isGenerating}>
                {isGenerating ? "Gerando PDF..." : "Baixar Relatório (PDF)"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
