type ButtonProps = {
  variant?: "flat" | "tonal" | "text" | "outlined";
  color?: "blue" | "gray" | "red" | "green";
  type?: "button" | "submit";
  label: string;
  onClick?: () => void;
};

export const Button = ({ variant = "flat", color = "blue", type = "button", label, onClick }: ButtonProps) => {
  const baseClass = "w-full py-2 px-4 rounded-md font-medium cursor-pointer";

  const colorClasses = {
    blue:
      variant === "tonal"
        ? "bg-blue-500/20 text-blue-700 hover:bg-blue-500/30"
        : variant === "outlined"
          ? "text-blue-700 border border-blue-700"
          : variant === "text"
            ? "text-blue-700 hover:text-blue-800"
            : "bg-blue-500 hover:bg-blue-600 text-white",
    gray:
      variant === "tonal"
        ? "bg-gray-500/20 text-gray-700 hover:bg-gray-500/30"
        : variant === "outlined"
          ? "text-gray-700 border border-gray-700"
          : variant === "text"
            ? "text-gray-700 hover:text-gray-800"
            : "bg-gray-500 hover:bg-gray-600 text-white",
    red:
      variant === "tonal"
        ? "bg-red-500/20 text-red-700 hover:bg-red-500/30"
        : variant === "outlined"
          ? "text-red-700 border border-red-700"
          : variant === "text"
            ? "text-red-700 hover:text-red-800"
            : "bg-red-500 hover:bg-red-600 text-white",
    green:
      variant === "tonal"
        ? "bg-green-500/20 text-green-700 hover:bg-green-500/30"
        : variant === "outlined"
          ? "text-green-700 border border-green-700"
          : variant === "text"
            ? "text-green-700 hover:text-green-800"
            : "bg-green-500 hover:bg-green-600 text-white",
  };

  const variantClasses = {
    flat: "",
    tonal: "",
    outlined: "",
    text: "",
  };

  const className = `${baseClass} ${colorClasses[color]} ${variantClasses[variant]}`;

  return (
    <button type={type} onClick={onClick} className={className}>
      {label}
    </button>
  );
};
