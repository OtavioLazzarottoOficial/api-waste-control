type InputProps = {
  label?: string;
  type: string;
  value?: string | number;
  placeholder?: string;
  inputWidth?: string;
  error?: string;
  disabled?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = ({
  label,
  type,
  value,
  placeholder,
  inputWidth,
  error,
  disabled,
  ...props
}: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        className={`appearance-none w-full rounded-lg border px-3 py-2 text-sm transition-colors duration-200 ${
          error ? "border-red-500" : "border-slate-300"
        } ${disabled ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-white text-slate-900 hover:border-slate-400"} focus:border-orange-400 focus:ring-2 focus:ring-orange-200 focus:outline-none ${
          inputWidth ? inputWidth : ""
        }`}
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        {...props}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};
