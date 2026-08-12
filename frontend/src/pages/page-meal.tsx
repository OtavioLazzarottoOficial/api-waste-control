import { Button } from "../components/button/button";
import { Input } from "../components/input/input";

import { MdOutlineEdit, MdOutlineErrorOutline } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { FiSun, FiMoon } from "react-icons/fi";
import { useFetchMeals } from "../hooks/useFetchMeals";
import { usePostMeal } from "../hooks/usePostMeal";
import { useMealFormZodSchema } from "../schemas/mealFormZodSchema";
import type { SubmitHandler } from "react-hook-form";
import type { Meal as MealModel } from "../models/meal.model";
import { Link } from "react-router-dom";
import {
  parseLocalDate,
  toInputDate,
} from "../helpers/convertDate";
import { useDeleteMeal } from "../hooks/useDeleteMeal";
import { useState } from "react";
import { useEditMeal } from "../hooks/useEditMeal";
import { Select } from "../components/select/select";

function Meal() {
  const [enableEditing, setEnableEditing] = useState<boolean>(false);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);

  const { data: meals, isLoading } = useFetchMeals();
  const { mutate: createMeal, isPending: isAdding } = usePostMeal();
  const { mutate: editMeal, isPending: isEditing } = useEditMeal();
  const { mutate: deleteMeal } = useDeleteMeal();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useMealFormZodSchema();

  const handlePostMeal: SubmitHandler<MealModel> = (data) => {
    createMeal({
      ...data,
      date: parseLocalDate(data.date),
    });

    setValue("date", "");
    setValue("turn", "" as "DINNER");
  };

  const clickEnableEditing = (meal: MealModel) => {
    setEnableEditing(true);
    setEditingMealId(meal.id!);
    setValue("date", toInputDate(meal.date));
    setValue("turn", meal.turn);
  };

  const handleEditMeal: SubmitHandler<MealModel> = (data) => {
    if (!editingMealId) return;

    editMeal({
      id: editingMealId, // ✅ pega do estado
      date: parseLocalDate(data.date),
      turn: data.turn,
    });

    setEnableEditing(false);
    setEditingMealId(null);
    setValue("date", "");
    setValue("turn", "" as "DINNER");
  };

  return (
    <div className="flex flex-col px-4 sm:px-12 lg:px-24 pt-10 sm:pt-14">
      <h2 className="text-2xl font-bold mb-4">Gerenciamento de Refeições</h2>
      <div className="flex flex-col gap-4">
        <div className="w-full bg-white/50 rounded-xl shadow-md p-6">
          <h3 className="text-md mb-2">Registrar Nova Refeição</h3>
          <form className="flex flex-col sm:flex-row sm:items-end gap-6">
            <Input
              label="Data"
              type="date"
              {...register("date")}
              error={errors.date?.message}
              disabled={isAdding || isEditing}
            />
            <div className="flex flex-col gap-2">
              <Select
                label="Turno"
                options={[
                  { value: "", label: "Selecione o turno" },
                  { value: "DINNER", label: "Almoço" },
                  { value: "AFTERNOON", label: "Jantar" },
                ]}
                {...register("turn")}
                disabled={isAdding || isEditing}
                error={errors.turn?.message}
              />
            </div>

            {enableEditing ? (
              <>
                <Button
                  type="submit"
                  onClick={() => handleSubmit(handleEditMeal)()}
                  disabled={isEditing}
                  isLoading={isEditing}
                >
                  {isEditing ? "Editando..." : "Editar Refeição"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setEnableEditing(false);
                    setEditingMealId(null);
                    setValue("date", "");
                    setValue("turn", "" as "DINNER");
                  }}
                  color="bg-green-400"
                  disabled={isEditing}
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <Button
                type="submit"
                onClick={handleSubmit(handlePostMeal)}
                disabled={isAdding}
                isLoading={isAdding}
              >
                {isAdding ? "Registrando..." : "Registrar Refeição"}
              </Button>
            )}
          </form>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <p className="text-gray-400 text-sm">Carregando registros...</p>
          </div>
        ) : !meals || meals.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-12">
            <MdOutlineErrorOutline className="w-10 h-10 text-gray-300" />
            <p className="text-gray-400 text-sm">
              Nenhum registro de desperdício encontrado.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col w-full bg-white/50 rounded-xl shadow-md">
            {meals?.map((meal) => (
              <li
                key={meal.id}
                className="flex flex-col sm:flex-row justify-between sm:items-center w-full min-h-[5.5rem] border-b border-black/10 last:border-b-0 py-4 px-4 sm:px-8 hover:bg-zinc-50 transition-colors gap-4"
              >
                <div className="flex flex-row items-center gap-6">
                  {/* Calendário Estilizado */}
                  <div className="flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 min-w-[4.5rem] text-center shadow-sm">
                    <span className="text-2xl font-black text-slate-800 leading-none">
                      {new Date(meal.date).toLocaleDateString("pt-BR", { day: "2-digit", timeZone: "UTC" })}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">
                      {new Date(meal.date).toLocaleDateString("pt-BR", { month: "short", timeZone: "UTC" }).replace('.', '')}
                    </span>
                  </div>

                  {/* Informações da Refeição */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-row items-center gap-2.5">
                      <span className="text-md font-semibold text-slate-900">
                        {new Date(meal.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" })}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {(() => {
                          const weekday = new Date(meal.date).toLocaleDateString("pt-BR", { weekday: "long", timeZone: "UTC" });
                          return weekday.charAt(0).toUpperCase() + weekday.slice(1);
                        })()}
                      </span>
                    </div>

                    <div className="flex items-center">
                      {meal.turn === "DINNER" ? (
                        <span className="inline-flex items-center gap-1.5 text-xs bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded-md font-medium">
                          <FiSun className="w-3.5 h-3.5" />
                          Almoço
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs bg-sky-50 text-sky-800 border border-sky-200/60 px-2 py-0.5 rounded-md font-medium">
                          <FiMoon className="w-3.5 h-3.5" />
                          Jantar
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row gap-2 self-end sm:self-auto">
                  <Button type="button" color="bg-gray-400">
                    <Link to={`/food-details/${meal.id}`}>Detalhes</Link>
                  </Button>

                  <Button
                    type="button"
                    onClick={() => clickEnableEditing(meal)}
                  >
                    <MdOutlineEdit />
                  </Button>

                  <Button
                    type="button"
                    color="bg-red-500"
                    onClick={() => deleteMeal(meal.id!)}
                  >
                    <AiOutlineDelete />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Meal;
