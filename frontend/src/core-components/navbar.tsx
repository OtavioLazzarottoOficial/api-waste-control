import { Link, useLocation } from "react-router-dom";
import Soon from "../components/soon";
import { TfiDashboard } from "react-icons/tfi";
import { FaList } from "react-icons/fa";
import { PiBowlFoodBold, PiKnife, PiBookOpen } from "react-icons/pi";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiX } from "react-icons/fi";

type NavBarProps = {
  onClose?: () => void;
};

function NavBar({ onClose }: NavBarProps) {
  const { pathname } = useLocation();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: TfiDashboard },
    { href: "/category", label: "Categorias", icon: FaList },
    { href: "/food", label: "Alimentos", icon: PiBowlFoodBold },
    { href: "/meals", label: "Refeições", icon: PiKnife },
    { href: "/cardapio", label: "Cardápio", icon: PiBookOpen },
    { href: "/waste", label: "Desperdício", icon: RiDeleteBinLine },
  ];

  return (
    <nav className="relative flex flex-col w-full h-full items-center bg-amber-700">
      {/* Close Button on Mobile Drawer */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-white hover:text-amber-200 lg:hidden cursor-pointer"
        >
          <FiX className="w-6 h-6" />
        </button>
      )}

      <Soon />
      <ul className="flex flex-col w-full mt-4 gap-4 justify-center items-center">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              to={href}
              onClick={onClose}
              className={`flex w-52 py-3 px-4 rounded-full gap-4 ${
                isActive ? "bg-black" : ""
              }`}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "text-white" : "text-black"}`}
              />
              <li className="text-white list-none">
                {label}
              </li>
            </Link>
          );
        })}
      </ul>
    </nav>
  );
}

export default NavBar;
