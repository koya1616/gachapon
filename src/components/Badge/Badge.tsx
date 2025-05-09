const Badge = ({
  text,
  color,
}: {
  text: string;
  color: "green" | "red" | "blue" | "gray" | "yellow";
}) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}
    >
      {text}
    </span>
  );
};

export default Badge;
