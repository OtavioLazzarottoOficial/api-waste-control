import React, { useState } from "react";
import { useFetchMeals } from "../hooks/useFetchMeals";
import { useFetchCategories } from "../hooks/useFetchCategories";
import { useGetItemMealById } from "../hooks/useGetItemMealById";
import { useFetchFoods } from "../hooks/useFetchFoods";
import { formatDate } from "../helpers/convertDate";
import { Button } from "../components/button/button";
import { Input } from "../components/input/input";
import { Select } from "../components/select/select";
import { FaPrint, FaEye } from "react-icons/fa";
import { PiBookOpen } from "react-icons/pi";

interface MenuItemType {
  id: string;
  foodId: string;
  mealId?: string;
  quantityConsumed: number;
  quantityServed: number;
  food?: {
    id: string;
    name: string;
    categoryId: string;
    createdAt?: string;
    updatedAt?: string;
  } | null;
  displayName: string;
}

export function Cardapio() {
  const [selectedMealId, setSelectedMealId] = useState<string>("");
  const [menuTitle, setMenuTitle] = useState<string>("CARDÁPIO DO DIA");
  const [menuSubtitle, setMenuSubtitle] = useState<string>("");
  const [menuFootnote, setMenuFootnote] = useState<string>(
    "Aproveite a sua refeição! Sujeito a alterações sem aviso prévio."
  );
  const [layoutTheme, setLayoutTheme] = useState<
    "chalkboard" | "rustic" | "modern" | "minimalist"
  >("chalkboard");
  const [showQuantities, setShowQuantities] = useState<boolean>(false);
  const [showCategories, setShowCategories] = useState<boolean>(true);

  // States to customize items dynamically (enabled and custom names)
  const [enabledItems, setEnabledItems] = useState<{ [id: string]: boolean }>({});
  const [customNames, setCustomNames] = useState<{ [id: string]: string }>({});

  const { data: meals, isLoading: isLoadingMeals } = useFetchMeals();
  const { data: categories } = useFetchCategories();
  const { data: foods } = useFetchFoods();
  const { data: mealDetails, isLoading: isLoadingDetails } = useGetItemMealById(selectedMealId);

  // Map of category ID -> Name
  const categoriesMap = React.useMemo(() => {
    const map = new Map<string, string>();
    if (categories) {
      categories.forEach((cat) => {
        if (cat.id) map.set(cat.id, cat.name);
      });
    }
    return map;
  }, [categories]);

  // Map of food ID -> Category ID
  const foodsMap = React.useMemo(() => {
    const map = new Map<string, string>();
    if (foods) {
      foods.forEach((f) => {
        if (f.id) map.set(f.id, f.categoryId);
      });
    }
    return map;
  }, [foods]);

  // Group meal items by category
  const groupedItems = React.useMemo(() => {
    const groups: { [categoryName: string]: MenuItemType[] } = {};

    if (!mealDetails?.mealItems) return groups;

    mealDetails.mealItems.forEach((item) => {
      // Skip if disabled
      if (item.id && enabledItems[item.id] === false) return;

      const displayName = (item.id && customNames[item.id]) || item.food?.name || "Sem Nome";
      const categoryId = item.foodId ? foodsMap.get(item.foodId) : undefined;
      const categoryName =
        showCategories && categoryId
          ? categoriesMap.get(categoryId) || "Acompanhamentos/Geral"
          : "Pratos";

      if (!groups[categoryName]) {
        groups[categoryName] = [];
      }
      groups[categoryName].push({
        id: item.id || "",
        foodId: item.foodId,
        quantityConsumed: item.quantityConsumed,
        quantityServed: item.quantityServed,
        food: item.food ? { id: item.food.id, name: item.food.name, categoryId: categoryId || "" } : null,
        displayName,
      });
    });

    return groups;
  }, [mealDetails, enabledItems, customNames, showCategories, categoriesMap, foodsMap]);

  const handleMealChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mealId = e.target.value;
    setSelectedMealId(mealId);
    setEnabledItems({});
    setCustomNames({});

    const meal = meals?.find((m) => m.id === mealId);
    if (meal) {
      const formattedDate = formatDate(meal.date);
      const turnText = meal.turn === "DINNER" ? "Almoço" : "Jantar";
      setMenuTitle(`CARDÁPIO - ${turnText.toUpperCase()}`);
      setMenuSubtitle(`${turnText} • ${formattedDate}`);
    } else {
      setMenuTitle("CARDÁPIO DO DIA");
      setMenuSubtitle("");
    }
  };

  const handlePrint = () => {
    if (!selectedMealId) return;
    window.print();
  };

  const mealOptions = [
    { label: "Selecione uma refeição...", value: "" },
    ...(meals?.map((m) => ({
      label: `${formatDate(m.date)} - ${m.turn === "DINNER" ? "Almoço" : "Jantar"}`,
      value: m.id || "",
    })) || []),
  ];

  const themeOptions = [
    { label: "Quadro de Giz (Chalkboard)", value: "chalkboard" },
    { label: "Rústico / Warm", value: "rustic" },
    { label: "Moderno / Clean", value: "modern" },
    { label: "Minimalista", value: "minimalist" },
  ];

  const renderMenuCard = () => {
    return (
      <div
        className={`w-full h-full flex flex-col justify-between transition-all duration-300 p-8 ${
          layoutTheme === "chalkboard"
            ? "bg-slate-900 text-stone-100 font-serif border-4 border-dashed border-stone-400 rounded-xl"
            : layoutTheme === "rustic"
            ? "bg-[#FDFBF7] text-stone-800 font-serif border-8 border-double border-amber-800 rounded-sm"
            : layoutTheme === "modern"
            ? "bg-white text-slate-800 font-sans border border-slate-200 rounded-2xl relative overflow-hidden"
            : "bg-stone-50 text-stone-900 font-serif border border-stone-400"
        }`}
      >
        {/* Modern theme stripe decor */}
        {layoutTheme === "modern" && (
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 to-amber-600"></div>
        )}

        {/* Cardápio Header */}
        <div className="text-center">
          <h1
            className={`uppercase tracking-wider ${
              layoutTheme === "chalkboard"
                ? "text-3xl text-amber-200 font-bold border-b-2 border-stone-700/60 pb-3 mb-4"
                : layoutTheme === "rustic"
                ? "text-3xl text-amber-950 font-extrabold border-b border-amber-800/20 pb-2 mb-1"
                : layoutTheme === "modern"
                ? "text-2.5xl text-slate-950 font-black mb-1 font-sans"
                : "text-2xl font-normal tracking-[0.2em] mb-2 border-b border-stone-400 pb-3 text-stone-900"
            }`}
          >
            {menuTitle || "CARDÁPIO"}
          </h1>

          {/* Decorative element for rustic theme */}
          {layoutTheme === "rustic" && (
            <div className="text-amber-800/40 text-xs mb-3">~ ❁ ~</div>
          )}

          {menuSubtitle && (
            <p
              className={`${
                layoutTheme === "chalkboard"
                  ? "text-xs italic text-stone-300 font-sans tracking-wide"
                  : layoutTheme === "rustic"
                  ? "text-xs tracking-widest uppercase text-amber-700 font-sans font-bold"
                  : layoutTheme === "modern"
                  ? "text-xs font-bold text-orange-500 tracking-wider uppercase font-sans"
                  : "text-xs tracking-[0.2em] text-stone-600 uppercase font-sans font-light"
              }`}
            >
              {menuSubtitle}
            </p>
          )}
        </div>

        {/* Cardápio Body (Menu list) */}
        <div className="flex-1 my-6 space-y-5">
          {Object.keys(groupedItems).length === 0 ? (
            <div className="text-center py-12 text-sm text-stone-400 italic">
              Nenhum prato ativo selecionado.
            </div>
          ) : (
            Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="space-y-2.5">
                {showCategories && (
                  <h2
                    className={`font-semibold ${
                      layoutTheme === "chalkboard"
                        ? "text-md text-amber-300 border-b border-stone-700 pb-1 uppercase tracking-wide font-sans font-bold"
                        : layoutTheme === "rustic"
                        ? "text-sm text-amber-900 border-b border-amber-800/10 pb-0.5 font-sans uppercase tracking-wider font-extrabold"
                        : layoutTheme === "modern"
                        ? "text-xs text-slate-700 font-bold bg-slate-100 px-3 py-1 rounded-md tracking-wide font-sans"
                        : "text-center text-xs tracking-[0.15em] text-stone-800 font-extrabold uppercase border-b border-stone-300 pb-1 font-sans"
                    }`}
                  >
                    {category}
                  </h2>
                )}

                <ul className="space-y-2">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className={`flex justify-between items-baseline gap-2 ${
                        layoutTheme === "minimalist" ? "flex-col items-center gap-0.5" : ""
                      }`}
                    >
                      <span
                        className={`font-semibold ${
                          layoutTheme === "chalkboard"
                            ? "text-base text-white"
                            : layoutTheme === "rustic"
                            ? "text-base text-stone-900 font-bold"
                            : layoutTheme === "modern"
                            ? "text-sm text-slate-950 font-bold font-sans"
                            : "text-sm text-stone-950 italic text-center"
                        }`}
                      >
                        {item.displayName}
                      </span>

                      {layoutTheme !== "minimalist" && (
                        <span className="flex-1 border-b border-dotted border-stone-500/40 self-end mb-1"></span>
                      )}

                      {showQuantities ? (
                        <span
                          className={`${
                            layoutTheme === "chalkboard"
                              ? "text-xs text-stone-300 font-sans font-medium"
                              : layoutTheme === "rustic"
                              ? "text-xs text-stone-600 font-sans"
                              : layoutTheme === "modern"
                              ? "text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full font-sans"
                              : "text-xs text-stone-500 font-sans mt-0.5 block text-center"
                          }`}
                        >
                          {item.quantityServed}g
                        </span>
                      ) : (
                        layoutTheme !== "minimalist" && (
                          <span className="text-[10px] opacity-25">★</span>
                        )
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        {/* Cardápio Footer */}
        {menuFootnote && (
          <div
            className={`text-center border-t pt-4 ${
              layoutTheme === "chalkboard"
                ? "border-stone-700 text-[11px] text-stone-300 italic font-sans"
                : layoutTheme === "rustic"
                ? "border-amber-800/10 text-xs text-amber-800/70 italic"
                : layoutTheme === "modern"
                ? "border-slate-100 text-[11px] text-slate-400 font-medium font-sans"
                : "border-stone-300 text-[10px] tracking-[0.1em] text-stone-500 uppercase font-sans"
            }`}
          >
            {menuFootnote}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col px-4 sm:px-12 lg:px-24 pt-10 sm:pt-14">
      {/* Optimized CSS Injection for perfect printing */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media print {
            /* 1. Hide the entire screen UI completely */
            .no-print {
              display: none !important;
            }
            
            /* 2. Reset margins and backgrounds for print */
            body, html {
              background-color: white !important;
              margin: 0 !important;
              padding: 0 !important;
              height: auto !important;
              overflow: visible !important;
            }
            
            /* 3. Disable layout positioning that can stretch the printed page */
            main {
              margin: 0 !important;
              padding: 0 !important;
              background: transparent !important;
            }

            /* 4. Force full-screen print output, centering layout, applying color printing */
            #print-menu-area {
              display: flex !important;
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 21cm !important;
              height: 29.7cm !important; /* Standard A4 dimensions */
              box-sizing: border-box !important;
              margin: 0 !important;
              border-radius: 0 !important;
              box-shadow: none !important;
              z-index: 99999 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            /* Specific theme styling overrides for printer */
            #print-menu-area.theme-chalkboard {
              background-color: #0f172a !important;
              color: #f5f5f4 !important;
              border: 12px double #a8a29e !important;
              padding: 3.5cm 2.5cm !important;
            }
            #print-menu-area.theme-rustic {
              background-color: #FDFBF7 !important;
              color: #1c1917 !important;
              border: 16px double #78350f !important;
              padding: 3.5cm 2.5cm !important;
            }
            #print-menu-area.theme-modern {
              background-color: #ffffff !important;
              color: #1c1917 !important;
              border-top: 25px solid #f97316 !important;
              padding: 4cm 2.5cm 2.5cm 2.5cm !important;
            }
            #print-menu-area.theme-minimalist {
              background-color: #fafaf9 !important;
              color: #1c1917 !important;
              border: 1px solid #44403c !important;
              padding: 4cm 3cm !important;
            }

            /* 5. Ensure printable area is visible */
            #print-menu-area, #print-menu-area * {
              visibility: visible !important;
            }
            
            @page {
              size: A4 portrait;
              margin: 0;
            }
          }
        `,
        }}
      />

      {/* Printable Card Area - hidden by default, visible only during print */}
      {selectedMealId && !isLoadingDetails && (
        <div
          id="print-menu-area"
          className={`hidden print:flex theme-${layoutTheme}`}
        >
          {renderMenuCard()}
        </div>
      )}

      {/* Screen UI Wrapper - completely hidden during print */}
      <div className="flex flex-col no-print">
        <h2 className="text-2xl font-bold mb-4">Criar Cardápio</h2>

        {isLoadingMeals ? (
          <div className="flex items-center justify-center p-12 bg-white/50 rounded-xl shadow-md">
            <p className="text-gray-400 text-sm">Carregando refeições registradas...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Controls Column (5 columns out of 12) */}
            <div className="lg:col-span-5 bg-white/50 rounded-xl shadow-md p-6 flex flex-col gap-4">
              <h3 className="text-md mb-2 font-semibold text-slate-800 flex items-center gap-2">
                <PiBookOpen className="w-5 h-5 text-amber-700" /> Configurar Cardápio
              </h3>

              {/* Meal Selector */}
              <Select
                label="1. Selecione a Refeição base"
                options={mealOptions}
                value={selectedMealId}
                onChange={handleMealChange}
              />

              {selectedMealId && (
                <>
                  {/* Theme Selector */}
                  <Select
                    label="2. Escolha o Estilo visual"
                    options={themeOptions}
                    value={layoutTheme}
                    onChange={(e) =>
                      setLayoutTheme(
                        e.target.value as "chalkboard" | "rustic" | "modern" | "minimalist"
                      )
                    }
                  />

                  {/* Texts customization */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-sm font-semibold text-slate-700">3. Customize os Textos</h4>
                    <Input
                      label="Título Principal"
                      type="text"
                      value={menuTitle}
                      onChange={(e) => setMenuTitle(e.target.value)}
                    />
                    <Input
                      label="Subtítulo / Informações"
                      type="text"
                      value={menuSubtitle}
                      onChange={(e) => setMenuSubtitle(e.target.value)}
                    />
                    <Input
                      label="Nota de Rodapé"
                      type="text"
                      value={menuFootnote}
                      onChange={(e) => setMenuFootnote(e.target.value)}
                    />
                  </div>

                  {/* Toggles */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-black/5">
                    <h4 className="text-sm font-semibold text-slate-700">4. Opções de Exibição</h4>
                    <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-600">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded text-orange-500 focus:ring-orange-400"
                        checked={showCategories}
                        onChange={(e) => setShowCategories(e.target.checked)}
                      />
                      Agrupar por categoria de alimento
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-600">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded text-orange-500 focus:ring-orange-400"
                        checked={showQuantities}
                        onChange={(e) => setShowQuantities(e.target.checked)}
                      />
                      Mostrar quantidades servidas (g)
                    </label>
                  </div>

                  {/* Custom Food Names & Inclusion */}
                  <div className="flex flex-col gap-3 border-t border-black/5 pt-4">
                    <h4 className="text-sm font-semibold text-slate-700">5. Pratos no Cardápio</h4>
                    {isLoadingDetails ? (
                      <div className="text-center py-4 text-xs text-slate-400">Carregando itens...</div>
                    ) : !mealDetails?.mealItems || mealDetails.mealItems.length === 0 ? (
                      <div className="text-center py-4 text-xs text-red-500 font-medium">
                        Esta refeição não possui nenhum alimento vinculado.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 max-h-[260px] overflow-y-auto pr-1">
                        {mealDetails.mealItems.map((item, index) => (
                          <div
                            key={item.id || index}
                            className="flex flex-col gap-1 border-b border-black/5 pb-3 last:border-none"
                          >
                            <div className="flex items-center justify-between">
                              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="w-3.5 h-3.5 rounded text-orange-500 focus:ring-orange-400"
                                  checked={item.id ? enabledItems[item.id] !== false : true}
                                  onChange={(e) => {
                                    if (item.id) {
                                      setEnabledItems((prev) => ({
                                        ...prev,
                                        [item.id!]: e.target.checked,
                                      }));
                                    }
                                  }}
                                />
                                {item.food?.name}
                              </label>
                              {showQuantities && (
                                <span className="text-[10px] text-slate-400">
                                  {item.quantityServed}g servidos
                                </span>
                              )}
                            </div>
                            {item.id && enabledItems[item.id] !== false && (
                              <input
                                type="text"
                                className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 w-full focus:outline-none focus:border-orange-400"
                                placeholder="Nome fantasia no menu..."
                                value={(item.id && customNames[item.id]) ?? item.food?.name ?? ""}
                                onChange={(e) => {
                                  if (item.id) {
                                    setCustomNames((prev) => ({
                                      ...prev,
                                      [item.id!]: e.target.value,
                                    }));
                                  }
                                }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Print Button */}
                  <Button
                    onClick={handlePrint}
                    disabled={!mealDetails?.mealItems || mealDetails.mealItems.length === 0}
                    className="w-full flex items-center justify-center gap-2 mt-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg p-2 h-10 cursor-pointer"
                  >
                    <FaPrint /> Imprimir Cardápio (PDF)
                  </Button>
                </>
              )}
            </div>

            {/* Live Preview Area (7 columns out of 12) */}
            <div className="lg:col-span-7 bg-white/50 rounded-xl shadow-md p-6 flex flex-col gap-3 min-h-[680px]">
              <h3 className="text-md mb-1 font-semibold text-slate-800 flex items-center gap-2">
                <FaEye className="text-orange-500" /> Visualização Prévia
              </h3>
              <p className="text-xs text-gray-500 mb-2">
                Veja em tempo real a formatação do cardápio final.
              </p>

              {/* Dark wood/slate table backdrop canvas */}
              <div className="w-full flex-1 bg-zinc-800 rounded-xl p-8 flex justify-center items-center shadow-inner relative overflow-hidden border border-zinc-700 min-h-[500px]">
                {!selectedMealId ? (
                  <div className="flex flex-col items-center gap-3 p-12 text-center max-w-sm">
                    <PiBookOpen className="text-5xl text-zinc-600 animate-pulse" />
                    <p className="text-zinc-400 font-medium text-sm">
                      Selecione uma refeição no menu de configurações para pré-visualizar o cardápio.
                    </p>
                  </div>
                ) : isLoadingDetails ? (
                  <div className="flex flex-col items-center gap-3 p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    <p className="text-zinc-400 text-xs font-medium">Carregando itens...</p>
                  </div>
                ) : (
                  /* Preview container displaying the exact rendered card */
                  <div className="w-full max-w-[450px] min-h-[580px] shadow-2xl">
                    {renderMenuCard()}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cardapio;
