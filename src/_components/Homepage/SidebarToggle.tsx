import { Filter } from 'lucide-react';

const SidebarToggle = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md"
    >
      <Filter className="w-5 h-5 text-gray-700 dark:text-gray-200" />
    </button>
  );
};

export default SidebarToggle;
