export const Button = ({
  variant,
  color,
  type,
  label,
  onClick,
}: {
  variant?: "flat" | "tonal" | "text" | "outlined";
  color?: "blue" | "gray";
  type?: "button" | "submit";
  label: string;
  onClick?: () => void;
}) => {
  const buttonVariant = variant || "flat";
  const buttonColor = color || "blue";
  const buttonType = type || "button";

  const baseXClass = "w-full py-2 px-4 rounded-md font-medium text-white";
  const buttonColorClass = buttonColor === "blue" ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-500 hover:bg-gray-600";
  const buttonVariantClass =
    buttonVariant === "flat"
      ? "border border-gray-300"
      : buttonVariant === "tonal"
        ? "shadow-md"
        : buttonVariant === "outlined"
          ? "border border-gray-300"
          : "text-sm";
  return (
    <button type={buttonType} onClick={onClick} className={`${baseXClass} ${buttonColorClass} ${buttonVariantClass}`}>
      {label}
    </button>
  );
};
