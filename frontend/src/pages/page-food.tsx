import { type SubmitHandler } from "react-hook-form";

import { Button } from "../components/button/button";
import { Input } from "../components/input/input";
import { Select } from "../components/select/select";

import { MdOutlineEdit, MdOutlineErrorOutline } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { useFetchFoods } from "../hooks/useFetchFoods";
import { useFetchCategories } from "../hooks/useFetchCategories";
import { usePostFood } from "../hooks/usePostFood";

import type { Food as FoodModel } from "../models/food.model";
import { useFoodFormZodSchema } from "../schemas/foodFormZodSchema";
import { useState, useMemo } from "react";
import { useDeleteFood } from "../hooks/useDeleteFood";
import { useEditFood } from "../hooks/useEditFood";

function Food() {
  const [enableEditing, setEnableEditing] = useState<boolean>(false);
  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);

  // Filter and pagination states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const { data: foods, isLoading } = useFetchFoods();
  const { data: categories } = useFetchCategories();
  const postFood = usePostFood();
  const { mutate } = postFood;
  const isAdding = postFood.status === "pending";
  const { mutate: deleteFood } = useDeleteFood();
  const editFoodHook = useEditFood();
  const { mutate: editFood } = editFoodHook;
  const isEditing = editFoodHook.status === "pending";

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useFoodFormZodSchema();

  const handlePostFood: SubmitHandler<FoodModel> = (data) => {
    mutate(data);
    setValue("name", "");
    setValue("categoryId", "");
  };

  const handleEditFood: SubmitHandler<FoodModel> = (data) => {
    editFood({ ...data, id: editingFoodId! });
    setEnableEditing(false);
    setEditingFoodId(null);
    setValue("name", "");
    setValue("categoryId", "");
  };

  const clickEnableEditing = (food: FoodModel) => {
    setEnableEditing(true);
    setValue("name", food.name);
    setValue("categoryId", food.categoryId || "");
    setEditingFoodId(food.id!);
  };

  // Client-side filtering logic
  const filteredFoods = useMemo(() => {
    if (!foods) return [];
    return foods.filter((food) => {
      const matchesSearch = food.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "" || food.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [foods, searchTerm, selectedCategory]);

  // Pagination calculations
  const totalItems = filteredFoods.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const paginatedFoods = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredFoods.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredFoods, currentPage, itemsPerPage]);

  return (
    <div className="flex flex-col px-4 sm:px-12 lg:px-24 pt-10 sm:pt-14">
      <h2 className="text-2xl font-bold mb-4">Gerenciamento de Alimentos</h2>
      <div className="flex flex-col gap-4">
        {/* Form Card */}
        <form
          onSubmit={handleSubmit(enableEditing ? handleEditFood : handlePostFood)}
          className="w-full bg-white/50 rounded-xl shadow-md p-6"
        >
          <h3 className="text-md mb-2">Adicionar Novo Alimento</h3>
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            <Input
              label="Nome"
              type="text"
              placeholder="Ex: Arroz, feijão, carne, etc"
              {...register("name")}
              error={errors.name?.message}
              disabled={isAdding || isEditing}
            />
            <div className="flex flex-col gap-2">
              <Select
                label="Categoria"
                options={
                  [{ value: "", label: "Selecione uma categoria" }].concat(
                    categories?.map((c) => ({ value: c.id ?? "", label: c.name })) || []
                  )
                }
                {...register("categoryId")}
                disabled={isAdding || isEditing}
                error={errors.categoryId?.message}
              />
            </div>
            {enableEditing ? (
              <>
                <Button
                  type="submit"
                  disabled={isEditing}
                  isLoading={isEditing}
                >
                  {isEditing ? "Editando..." : "Editar Alimento"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setEnableEditing(false);
                    setEditingFoodId(null);
                    setValue("name", "");
                    setValue("categoryId", "");
                  }}
                  color="bg-green-400"
                  disabled={isEditing}
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <Button type="submit" disabled={isAdding} isLoading={isAdding}>
                {isAdding ? "Adicionando..." : "Adicionar Alimento"}
              </Button>
            )}
          </div>
        </form>

        {/* Filters Card */}
        {foods && foods.length > 0 && (
          <div className="w-full bg-white/50 rounded-xl shadow-md p-6 flex flex-col sm:flex-row sm:items-end gap-6">
            <div className="flex-1 w-full">
              <Input
                label="Pesquisar Alimento"
                type="text"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="w-full sm:w-64">
              <Select
                label="Filtrar por Categoria"
                options={[
                  { value: "", label: "Todas as categorias" },
                  ...(categories?.map((c) => ({
                    value: c.id ?? "",
                    label: c.name,
                  })) || []),
                ]}
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        )}

        {/* List Card */}
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <p className="text-gray-400 text-sm">Carregando registros...</p>
          </div>
        ) : !foods || foods.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-12 bg-white/50 rounded-xl shadow-md">
            <MdOutlineErrorOutline className="w-10 h-10 text-gray-300" />
            <p className="text-gray-400 text-sm">Nenhum alimento cadastrado.</p>
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-12 bg-white/50 rounded-xl shadow-md">
            <MdOutlineErrorOutline className="w-10 h-10 text-gray-300" />
            <p className="text-gray-400 text-sm">
              Nenhum alimento correspondente aos filtros selecionados.
            </p>
          </div>
        ) : (
          <div className="flex flex-col w-full bg-white/50 rounded-xl shadow-md overflow-hidden">
            <ul className="flex flex-col w-full">
              {paginatedFoods.map((food, index) => (
                <li
                  key={index}
                  className="flex flex-row justify-between items-center w-full h-16 border-b border-black/10 last:border-b-0 p-8 hover:bg-zinc-50 transition-colors"
                >
                  <div className="flex flex-col gap-2">
                    <h3 className="text-md">{food.name}</h3>
                    <p className="text-sm text-gray-500">{food.category?.name}</p>
                  </div>
                  <div className="flex flex-row gap-2">
                    <Button
                      type="button"
                      onClick={() => clickEnableEditing(food)}
                    >
                      <MdOutlineEdit />
                    </Button>
                    <Button
                      type="button"
                      color="bg-red-500"
                      onClick={() => deleteFood(food.id!)}
                    >
                      <AiOutlineDelete />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Pagination Controls */}
            {totalItems > itemsPerPage && (
              <div className="flex flex-col sm:flex-row justify-between items-center w-full px-8 py-4 bg-slate-50/50 border-t border-black/10 gap-4">
                <span className="text-sm text-gray-500">
                  Mostrando {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} a{" "}
                  {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} alimentos
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
                  <span className="text-sm font-medium text-slate-700 px-2">
                    Página {currentPage} de {totalPages}
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

export default Food;
