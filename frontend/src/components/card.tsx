import type { ReactNode } from "react";

type Props = {
  title: string;
  value: string | number | undefined;
  icon?: ReactNode;
  description?: string;
  color?: string;
};

function Card({ title, value, icon, description, color = "border-indigo-500" }: Props) {
  return (
    <div className={`bg-white/50 rounded-xl shadow-md p-6 w-full border-l-4 ${color} flex flex-col justify-between`}>
      <div className="flex flex-row justify-between items-start">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 font-medium">{title}</span>
          <span className="text-2xl font-bold text-slate-800 mt-2">
            {value !== undefined ? value : "—"}
          </span>
        </div>
        {icon && <div className="text-gray-400 mt-0.5">{icon}</div>}
      </div>
      {description && (
        <span className="text-xs text-gray-400 mt-3 font-medium">
          {description}
        </span>
      )}
    </div>
  );
}

export default Card;
