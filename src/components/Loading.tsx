const Loading = () => {
  return (
    <div className="text-center py-10" data-testid="loading">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
    </div>
  );
};

export default Loading;
