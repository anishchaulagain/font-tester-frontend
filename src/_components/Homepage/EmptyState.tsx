import React from 'react';
import { motion } from 'framer-motion';
import { Search, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  onClearFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters }) => {
  return (
    <motion.div
      className="  flex flex-col items-center justify-center px-4 lg:px-6 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mb-8">
        <Search className="w-16 h-16 text-gray-400 dark:text-gray-500" />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        No fonts found
      </h3>

      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        We couldn't find any fonts matching your current search criteria. 
        Try adjusting your filters or search terms.
      </p>

      <motion.button
        onClick={onClearFilters}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <RefreshCw className="w-5 h-5" />
        Clear All Filters
      </motion.button>
    </motion.div>
  );
};

export default EmptyState;
