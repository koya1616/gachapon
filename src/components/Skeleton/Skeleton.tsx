const Skeleton = ({
  h,
}: {
  h: number;
}) => <div className={`h-${h} bg-gray-200 rounded animate-pulse`} />;

export default Skeleton;
