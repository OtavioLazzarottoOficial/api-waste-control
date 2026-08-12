import { RiLogoutBoxLine } from "react-icons/ri";
import { useAuth } from "../contexts/auth-context";
import { SlArrowDown } from "react-icons/sl";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

type HeaderProps = {
  onMenuToggle?: () => void;
};

function Header({ onMenuToggle }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const { logout, user } = useAuth();

  const toggleDropdown = () => {
    setIsDropdownOpen((previous) => !previous);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <header className="relative w-full h-20 border-b border-black/10 bg-white text-slate-900 px-4 sm:px-6 flex items-center shrink-0">
      {onMenuToggle && (
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden mr-3 text-slate-700 hover:text-black cursor-pointer"
        >
          <FiMenu className="w-6 h-6" />
        </button>
      )}

      <h1 className="text-base sm:text-xl font-bold truncate">Visão Geral do Restaurante</h1>

      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <div className="relative">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer"
            onClick={toggleDropdown}
          >
            <span className="max-w-[70px] sm:max-w-none truncate">{user?.name ?? "Usuário"}</span>
            <SlArrowDown className="text-slate-500 w-3 h-3" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl z-10">
              <Link
                to="/cadastro"
                onClick={closeDropdown}
                className="block px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Cadastrar usuário
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-slate-900 px-3 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-black cursor-pointer"
          onClick={logout}
        >
          <RiLogoutBoxLine className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
