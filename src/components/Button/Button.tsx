type ButtonProps = {
  variant?: "flat" | "tonal" | "text" | "outlined";
  color?: "blue" | "gray" | "red" | "green";
  type?: "button" | "submit";
  label: string;
  onClick?: () => void;
};

export const Button = ({ variant = "flat", color = "blue", type = "button", label, onClick }: ButtonProps) => {
  const baseClass = "w-full py-2 px-4 rounded-md font-medium text-white";

  const colorClasses = {
    blue: "bg-blue-500 hover:bg-blue-600",
    gray: "bg-gray-500 hover:bg-gray-600",
    red: "bg-red-500 hover:bg-red-600",
    green: "bg-green-500 hover:bg-green-600",
  };

  const variantClasses = {
    flat: "border border-gray-300",
    tonal: "shadow-md",
    outlined: "border border-gray-300",
    text: "text-sm",
  };

  const className = `${baseClass} ${colorClasses[color]} ${variantClasses[variant]}`;

  return (
    <button type={type} onClick={onClick} className={className}>
      {label}
    </button>
  );
};
