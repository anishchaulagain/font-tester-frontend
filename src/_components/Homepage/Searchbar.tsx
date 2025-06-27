import React from 'react';
import { motion } from 'framer-motion';
import { Search,  Clock, Type } from 'lucide-react';
import type { FilterOptions } from '@/types/font.types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useSearchParams } from 'react-router-dom';

interface SearchBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: Partial<FilterOptions>) => void;
  resultsCount: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ filters, onFiltersChange, resultsCount }) => {
  const sortOptions = [
    { value: 'name', label: 'Alphabetical', icon: Type },
    { value: 'recent', label: 'Recently Added', icon: Clock },

  ];

  const [searchParams, setSearchParams] = useSearchParams();

  const handleQueryChange = (query: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('query', query);
    setSearchParams(newParams);
    onFiltersChange({ query });
  };

  const handleSortChange = (sortBy: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sortBy', sortBy);
    setSearchParams(newParams);
    onFiltersChange({ sortBy: sortBy as FilterOptions['sortBy'] });
  };

  return (
    <motion.div
      className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search font families..."
            value={filters.query}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="pl-12 pr-4 py-4 text-lg bg-gray-50 dark:bg-[#282a2c] border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-[#babdbc]"
          />
        </div>

        {/* Sort Options */}
        <div className="items-center gap-2 hidden md:flex">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
            Sort by:
          </span>

          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[200px] px-4 py-2 bg-gray-100 dark:bg-[#282a2c] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-700 dark:text-gray-300">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(({ value, label, icon: Icon }) => (
                <SelectItem key={value} value={value}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-x-2">
          <span className="font-semibold text-gray-900 dark:text-white">{resultsCount}</span> font families available
        </p>
      </div>
    </motion.div>
  );
};

export default SearchBar;