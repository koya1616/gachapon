type ButtonProps = {
  variant?: "flat" | "tonal" | "outlined" | "text";
  color?: "blue" | "gray" | "red" | "green";
  type?: "button" | "submit";
  disabled?: boolean;
  width?: string;
  fontSize?: "text-base" | "text-lg" | "text-xl";
  onClick?: () => void;
} & (
  | {
      children: React.ReactNode;
      label?: string;
    }
  | {
      children?: undefined;
      label: string;
    }
);

/**
 * @param variant - variant (flat, tonal, outlined, text) - default: "flat"
 * @param color - color (blue, gray, red, green) - default: "blue"
 * @param type - type (button, submit) - default: "button"
 * @param label - 表示させるテキスト
 * @param disabled - default: false
 * @param width - Tailwindをそのまま反映
 * @param fontSize - フォントサイズ (text-base, text-lg, text-xl) - default: "text-base"
 * @param onClick
 */
export const Button = ({
  children,
  variant = "flat",
  color = "blue",
  type = "button",
  label,
  disabled = false,
  width,
  fontSize = "text-base",
  onClick,
}: ButtonProps) => {
  const baseClass = "py-2 px-4 rounded-md font-medium";

  const colorBaseClasses = {
    blue: {
      base: "text-blue-700",
      bg: "bg-blue-500 hover:bg-blue-600 text-white",
      tonal: "bg-blue-500/20 hover:bg-blue-500/30",
      hover: "hover:text-blue-800",
      border: "border-blue-700",
    },
    gray: {
      base: "text-gray-700",
      bg: "bg-gray-500 hover:bg-gray-600 text-white",
      tonal: "bg-gray-500/20 hover:bg-gray-500/30",
      hover: "hover:text-gray-800",
      border: "border-gray-700",
    },
    red: {
      base: "text-red-500",
      bg: "bg-red-500 hover:bg-red-600 text-white",
      tonal: "bg-red-500/20 hover:bg-red-500/30",
      hover: "hover:text-red-800",
      border: "border-red-500",
    },
    green: {
      base: "text-green-700",
      bg: "bg-green-500 hover:bg-green-600 text-white",
      tonal: "bg-green-500/20 hover:bg-green-500/30",
      hover: "hover:text-green-800",
      border: "border-green-700",
    },
  };

  const getVariantClass = () => {
    const colorBase = colorBaseClasses[color];

    switch (variant) {
      case "tonal":
        return `${colorBase.base} ${colorBase.tonal}`;
      case "outlined":
        return `${colorBase.base} border ${colorBase.border}`;
      case "text":
        return `${colorBase.base} ${colorBase.hover}`;
      default:
        return colorBase.bg;
    }
  };

  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

  const className = `${baseClass} ${getVariantClass()} ${disabledClass} ${width} ${fontSize}`;

  return (
    <button type={type} onClick={onClick} className={className} disabled={disabled}>
      {children || label}
    </button>
  );
};
