import { Button } from "../components/button/button";
import { Input } from "../components/input/input";

import { MdOutlineEdit, MdOutlineErrorOutline } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { useFetchCategories } from "../hooks/useFetchCategories";
import { usePostCategory } from "../hooks/usePostCategory";
import { type SubmitHandler } from "react-hook-form";

import type { Category as CategoryModel } from "../models/category.model";
import { useCategoryFormZodSchema } from "../schemas/categoryFormZodSchema";
import { useDeleteCategory } from "../hooks/useDeleteCategory";
import { useEditCategory } from "../hooks/useEditCategory";
import { useState, useMemo } from "react";

function Category() {
  const [enableEditing, setEnableEditing] = useState<boolean>(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );

  // Filter and pagination states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const { data: categories, isLoading } = useFetchCategories();
  const { mutate: deleteCategory } = useDeleteCategory();
  const { mutate, isPending: isAdding } = usePostCategory();
  const { mutate: editCategory, isPending: isEditing } = useEditCategory();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useCategoryFormZodSchema();

  const handlePostCategory: SubmitHandler<CategoryModel> = (data) => {
    mutate(data);
    setValue("name", "");
  };

  const handleEditCategory: SubmitHandler<CategoryModel> = (data) => {
    editCategory({ ...data, id: editingCategoryId! });
    setEnableEditing(false);
    setEditingCategoryId(null);
    setValue("name", "");
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id);
  };

  const clickEnableEditing = (category: CategoryModel) => {
    setEnableEditing(true);
    setValue("name", category.name);
    setEditingCategoryId(category.id!);
  };

  // Client-side filtering logic
  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  // Pagination calculations
  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCategories, currentPage, itemsPerPage]);

  return (
    <div className="flex flex-col px-4 sm:px-12 lg:px-24 pt-10 sm:pt-14">
      <h2 className="text-2xl font-bold mb-4">Categorias</h2>
      <div className="flex flex-col gap-4">
        {/* Form Card */}
        <form
          className="w-full bg-white/50 rounded-xl shadow-md p-6"
          onSubmit={handleSubmit(enableEditing ? handleEditCategory : handlePostCategory)}
        >
          <h3 className="text-md mb-2">Adicionar Nova Categoria</h3>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <Input
              label="Nome"
              type="text"
              placeholder="Ex: Graos, bebidas, carnes, etc"
              {...register("name")}
              error={errors.name?.message}
              disabled={isAdding || isEditing}
            />
            {enableEditing ? (
              <>
                <Button type="submit" disabled={isEditing} isLoading={isEditing}>
                  {isEditing ? "Editando..." : "Editar Categoria"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setEnableEditing(false);
                    setEditingCategoryId(null);
                    setValue("name", "");
                  }}
                  color="bg-green-400"
                  disabled={isEditing}
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <Button type="submit" disabled={isAdding} isLoading={isAdding}>
                {isAdding ? "Adicionando..." : "Adicionar Categoria"}
              </Button>
            )}
          </div>
        </form>

        {/* Filters Card */}
        {categories && categories.length > 0 && (
          <div className="w-full bg-white/50 rounded-xl shadow-md p-6">
            <Input
              label="Pesquisar Categoria"
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        )}

        {/* List Card */}
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <p className="text-gray-400 text-sm">Carregando registros...</p>
          </div>
        ) : !categories || categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-12 bg-white/50 rounded-xl shadow-md">
            <MdOutlineErrorOutline className="w-10 h-10 text-gray-300" />
            <p className="text-gray-400 text-sm">Nenhuma categoria encontrada.</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-12 bg-white/50 rounded-xl shadow-md">
            <MdOutlineErrorOutline className="w-10 h-10 text-gray-300" />
            <p className="text-gray-400 text-sm">
              Nenhuma categoria correspondente aos filtros selecionados.
            </p>
          </div>
        ) : (
          <div className="flex flex-col w-full bg-white/50 rounded-xl shadow-md overflow-hidden">
            <ul className="flex flex-col w-full">
              {paginatedCategories.map((category, index) => (
                <li
                  key={index}
                  className="flex flex-row justify-between items-center w-full h-16 border-b border-black/10 last:border-b-0 p-8 hover:bg-zinc-50 transition-colors"
                >
                  <h3 className="text-md">{category.name}</h3>
                  <div className="flex flex-row gap-2">
                    <Button
                      type="button"
                      onClick={() => clickEnableEditing(category)}
                    >
                      <MdOutlineEdit />
                    </Button>
                    <Button
                      type="button"
                      color="bg-red-500"
                      onClick={() => handleDeleteCategory(category.id!)}
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
                  {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} categorias
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

export default Category;
