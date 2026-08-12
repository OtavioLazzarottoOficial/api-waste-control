type Option = { label: string; value: string };

type SelectProps = {
  label?: string;
  options: Option[];
  error?: string;
  disabled?: boolean;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = ({ label, options, error, disabled, className, ...props }: SelectProps) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <div className="relative">
        <select
          className={`appearance-none w-full rounded-lg border px-3 py-2 pr-10 text-sm transition-colors duration-200 ${
            error ? "border-red-500" : "border-slate-300"
          } ${disabled ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-white text-slate-900 hover:border-slate-400"} focus:border-orange-400 focus:ring-2 focus:ring-orange-200 focus:outline-none ${className || ""}`}
          disabled={disabled}
          {...props}
        >
          {options.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg
            className="h-4 w-4 text-slate-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default Select;
