import { Button } from "../components/button/button";
import { Input } from "../components/input/input";
import { Select } from "../components/select/select";

import { AiOutlineDelete } from "react-icons/ai";
import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import { useFetchFoods } from "../hooks/useFetchFoods";
import { useFetchCategories } from "../hooks/useFetchCategories";
import { useMealItemFormZodSchema } from "../schemas/itemMealFormZodSchema";
import type { ItemMeal } from "../models/itemMeal.model";
import type { Meal } from "../models/meal.model";
import type { SubmitHandler } from "react-hook-form";
import { usePostItemMeal } from "../hooks/usePostItemMeal";
import { useGetItemMealById } from "../hooks/useGetItemMealById";
import { formatDate } from "../helpers/convertDate";
import { useState, useEffect } from "react";
import { MdOutlineEdit, MdOutlineErrorOutline } from "react-icons/md";
import { usePostWaste } from "../hooks/usePostWaste";
import { useDeleteMealItem } from "../hooks/useDeleteMealItem";
import { useEditMealItem } from "../hooks/useEditMealItem";
import { notifyError } from "../helpers/notifications";

function FoodDetails() {
  enum ReasonType {
    LEFTOVER = "LEFTOVER",
    ITSPOILED = "ITSPOILED",
    ERROR_PREPARATION = "ERROR_PREPARATION",
  }

  const [enableEditing, setEnableEditing] = useState<boolean>(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [reportingItemId, setReportingItemId] = useState<string | null>(null);

  const [waste, setWaste] = useState<number>(0);
  const [reason, setReason] = useState<ReasonType>();

  // Filtros de Alimento
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("");
  const [searchFoodQuery, setSearchFoodQuery] = useState<string>("");

  const { mealId } = useParams();

  const { data: foods } = useFetchFoods();
  const { data: categories } = useFetchCategories();
  
  const { mutate: postItemMeal } = usePostItemMeal();
  const { mutate: postWaste } = usePostWaste();
  const { mutate: editMealItem } = useEditMealItem();
  const { mutate: deleteMealItem } = useDeleteMealItem();

  const { data: detailsMeal, isLoading } = useGetItemMealById(mealId!);

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useMealItemFormZodSchema();

  const quantityServedWatch = watch("quantityServed");
  
  useEffect(() => {
    if (quantityServedWatch !== undefined) {
      setValue("quantityConsumed", Number(quantityServedWatch || 0));
    }
  }, [quantityServedWatch, setValue]);

  const filteredFoods = foods?.filter((food) => {
    const matchesCategory = selectedCategoryFilter ? food.categoryId === selectedCategoryFilter : true;
    const matchesName = searchFoodQuery ? food.name.toLowerCase().includes(searchFoodQuery.toLowerCase()) : true;
    return matchesCategory && matchesName;
  });

  const handlePostMealItem: SubmitHandler<ItemMeal> = (data) => {
    data.mealId = mealId!;
    data.quantityConsumed = Number(data.quantityServed);
    postItemMeal(data);
    setValue("foodId", "");
    setValue("quantityServed", 0);
    setValue("quantityConsumed", 0);
  };

  const clickEnableEditing = (item: NonNullable<Meal["mealItems"]>[number]) => {
    setEnableEditing(true);
    setEditingItemId(item.id!);
    setValue("foodId", item.foodId);
    setValue("quantityServed", Number(item.quantityServed));
    setValue("quantityConsumed", Number(item.quantityConsumed));
  };

  const handleEditMealItem: SubmitHandler<ItemMeal> = (data) => {
    if (!editingItemId) return;
    editMealItem({
      id: editingItemId,
      data: {
        mealId: mealId!,
        foodId: data.foodId,
        quantityServed: Number(data.quantityServed),
        quantityConsumed: Number(data.quantityServed),
      },
    });
    setEnableEditing(false);
    setEditingItemId(null);
    setValue("foodId", "");
    setValue("quantityServed", 0);
    setValue("quantityConsumed", 0);
  };

  const handleDeleteMealItem = (id: string) => {
    deleteMealItem(id);
  };

  const handleReportWaste = (item: NonNullable<Meal["mealItems"]>[number]) => {
    postWaste({
      mealItemId: item.id!,
      quantity: waste,
      reason: reason!,
    });
    editMealItem({
      id: item.id!,
      data: {
        mealId: mealId!,
        foodId: item.foodId,
        quantityServed: Number(item.quantityServed),
        quantityConsumed: Number(item.quantityServed) - waste,
      },
    });
    setReportingItemId(null);
    setWaste(0);
    setReason(undefined);
  };

  return (
    <div className="flex flex-col px-4 sm:px-12 lg:px-24 pt-10 sm:pt-14">
      <div className="flex flex-row gap-4 items-center mb-6">
        <Button type="button" color="bg-transparent" textColor="text-gray-500">
          <Link to="/meals">
            <IoMdArrowBack className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">Detalhes da Refeição</h2>
          <p className="text-sm text-gray-500">
            {detailsMeal?.date ? formatDate(detailsMeal.date) : ""} - Turno:{" "}
            {detailsMeal?.turn === "DINNER" ? "Almoço" : "Jantar"}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-6">
        {/* Formulário de Adicionar/Editar Alimento */}
        <form
          onSubmit={handleSubmit(enableEditing ? handleEditMealItem : handlePostMealItem)}
          className="flex flex-col w-full lg:w-1/3 bg-white/50 rounded-xl shadow-md p-6 gap-4"
        >
          <div className="flex flex-col">
            <h3 className="text-md mb-2">{enableEditing ? "Editar Alimento" : "Adicionar Alimento"}</h3>
            <p className="text-sm text-gray-500 mb-4">
              Vincule um alimento servido nesta refeição
            </p>
          </div>

          {/* Filtros */}
          <div className="flex flex-col gap-2 p-4 bg-black/5 rounded-lg mb-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filtrar Alimentos</h4>
            <Select
              label="Categoria"
              options={[{ value: "", label: "Todas" }].concat(
                categories?.map((c) => ({ value: c.id ?? "", label: c.name })) || []
              )}
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            />
            <Input
              label="Pesquisar por Nome"
              placeholder="Pesquisar..."
              type="text"
              value={searchFoodQuery}
              onChange={(e) => setSearchFoodQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Select
              label="Alimento"
              options={[{ value: "", label: "Selecione..." }].concat(
                filteredFoods?.map((f) => ({ value: f.id ?? "", label: f.name })) || []
              )}
              {...register("foodId")}
              error={errors.foodId?.message}
            />

            <Input
              label="Qtd Servida (g)"
              placeholder="0"
              type="text"
              {...register("quantityServed")}
              error={errors.quantityServed?.message}
            />
          </div>

          {enableEditing ? (
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Salvar Alterações</Button>
              <Button
                type="button"
                color="bg-green-400"
                onClick={() => {
                  setEnableEditing(false);
                  setEditingItemId(null);
                  setValue("foodId", "");
                  setValue("quantityServed", 0);
                  setValue("quantityConsumed", 0);
                }}
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <Button type="submit">Adicionar Alimento</Button>
          )}
        </form>

        {/* Listagem de Itens Servidos */}
        <ul className="flex flex-col w-full lg:w-3/5 bg-white/50 rounded-xl shadow-md">
          <h1 className="text-2xl text-center text-gray-600 p-6">
            Itens Servidos
          </h1>

          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <p className="text-gray-400 text-sm">Carregando registros...</p>
            </div>
          ) : !detailsMeal || detailsMeal.mealItems?.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 p-12">
              <MdOutlineErrorOutline className="w-10 h-10 text-gray-300" />
              <p className="text-gray-400 text-sm">
                Nenhum registro de desperdício encontrado.
              </p>
            </div>
          ) : (
            detailsMeal.mealItems?.map((item) => (
              <li
                key={item.id}
                className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 w-full h-auto border-b border-black/10 last:border-b-0 px-4 sm:px-8 py-6 hover:bg-zinc-50 transition-colors"
              >
                {reportingItemId === item.id ? (
                  <div className="flex flex-col gap-4 w-full h-auto">
                    <div className="flex flex-col">
                      <h2 className="text-sm font-semibold">
                        Registrar Motivo do Desperdício
                      </h2>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (waste <= 0) {
                          notifyError("A quantidade desperdiçada deve ser maior que zero!");
                          return;
                        }
                        if (waste > Number(item.quantityServed)) {
                          notifyError("A quantidade desperdiçada não pode ser maior que a quantidade servida!");
                          return;
                        }
                        if (!reason) {
                          notifyError("Selecione um motivo para o desperdício!");
                          return;
                        }
                        handleReportWaste(item);
                      }}
                      className="flex flex-col sm:flex-row sm:items-end gap-4 w-full"
                    >
                      <div className="flex-1">
                        <Input
                          label="Qtd Desperdiçada (g)"
                          type="number"
                          placeholder="0"
                          value={waste || ""}
                          onChange={(e) => setWaste(Number(e.target.value))}
                        />
                      </div>

                      <div className="flex-1">
                        <Select
                          label="Motivo"
                          options={[
                            { value: "", label: "Selecione o motivo..." },
                            { value: "LEFTOVER", label: "Sobrou" },
                            { value: "ITSPOILED", label: "Estragou" },
                            { value: "ERROR_PREPARATION", label: "Erro no Preparo" },
                          ]}
                          value={reason || ""}
                          onChange={(e) => {
                            setReason(e.target.value as ReasonType);
                          }}
                        />
                      </div>

                      <div className="flex flex-row gap-2">
                        <Button type="submit" color="bg-green-500">
                          Salvar
                        </Button>
                        <Button
                          type="button"
                          color="bg-red-600"
                          onClick={() => {
                            setReportingItemId(null);
                            setWaste(0);
                            setReason(undefined);
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col">
                      <h3 className="text-md">{item.food?.name}</h3>
                      <p className="text-sm text-gray-500">
                        Servido: {item.quantityServed}g - Consumido:{" "}
                        {item.quantityConsumed}g
                      </p>
                      <p className="text-sm font-bold text-red-500">
                        Sobra: {Number(item.quantityServed) - Number(item.quantityConsumed)}g
                      </p>
                    </div>
                    <div className="flex flex-row gap-2 self-end sm:self-auto">
                      <Button
                        type="button"
                        textColor="black"
                        className="text-sm border font-light"
                        color="bg-white"
                        onClick={() => {
                          setReportingItemId(item.id!);
                          setWaste(Number(item.quantityServed) - Number(item.quantityConsumed));
                        }}
                      >
                        Reportar Desperdício
                      </Button>
                      <Button
                        type="button"
                        onClick={() => clickEnableEditing(item)}
                      >
                        <MdOutlineEdit />
                      </Button>
                      <Button
                        type="button"
                        color="bg-red-500"
                        onClick={() => handleDeleteMealItem(item.id!)}
                      >
                        <AiOutlineDelete />
                      </Button>
                    </div>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default FoodDetails;
