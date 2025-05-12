type TabProps<T extends string | number> = {
  items: readonly T[];
  activeTab: T;
  onClick: (name: T) => void;
};

const Tab = <T extends string | number>({ items, activeTab, onClick }: TabProps<T>) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-hide" aria-label="Tabs">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onClick(item)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
              activeTab === item
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {item}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tab;
