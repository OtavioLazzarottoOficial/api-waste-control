type ButtonProps = {
  children: React.ReactNode;
  buttonWidth?: string;
  type?: "button" | "submit" | "reset";
  textColor?: string;
  color?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
};

export const Button = ({
  children,
  buttonWidth,
  type,
  color,
  textColor,
  className,
  onClick,
  disabled,
  isLoading,
}: ButtonProps) => {
  return (
    <button
      className={`${color ? color : "bg-orange-500"} ${className || ""} ${disabled ? "opacity-60 cursor-not-allowed" : "hover:cursor-pointer"} ${textColor ? textColor : "text-white"} font-bold rounded-lg p-2 ${buttonWidth ? buttonWidth : "w-auto"} h-10 flex items-center justify-center gap-2`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};
