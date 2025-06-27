import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Globe, Palette, Sliders, Grid3X3, List, X } from 'lucide-react';
import type { FilterOptions, PreviewSettings } from '../../types/font.types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface FilterPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: Partial<FilterOptions>) => void;
  previewSettings: PreviewSettings;
  onPreviewSettingsChange: (settings: Partial<PreviewSettings>) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sampleTexts: Record<string, string>;

}

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onToggle,
  filters,
  onFiltersChange,
  previewSettings,
  onPreviewSettingsChange,
  viewMode,
  onViewModeChange,
  sampleTexts,
  
}) => {
  const categories = [
    { value: 'sans-serif', label: 'Sans Serif' },
    { value: 'serif', label: 'Serif' },
    { value: 'display', label: 'Display' },
    { value: 'handwriting', label: 'Handwriting' },
    { value: 'monospace', label: 'Monospace' },
  ];
  const languages = [
    { value: 'english', label: 'English' },
    { value: 'nepali', label: 'Nepali' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'arabic', label: 'Arabic' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'korean', label: 'Korean' },
  ];


  const activeFilters = [
    filters.language && { type: 'language', value: filters.language, label: `Language: ${filters.language}` },
    filters.category && { type: 'category', value: filters.category, label: `Category: ${filters.category}` },
  ].filter(Boolean);

  const clearFilter = (type: string) => {
    if (type === 'language') onFiltersChange({ language: '' });
    if (type === 'category') onFiltersChange({ category: '' });
  };

  return (
    <motion.div
      className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Filter Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={onToggle}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${isOpen
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filters & Preview</span>
            </motion.button>

            {activeFilters.length > 0 && (
              <div className="flex items-center gap-2">
                {activeFilters.map((filter: any) => (
                  <span
                    key={filter.type}
                    className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {filter.label}
                    <button
                      onClick={() => clearFilter(filter.type)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
            <motion.button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
                ? 'bg-white dark:bg-gray-600 text-black dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400'
                }`}
              whileHover={{ scale: 1.05 }}
            >
              <Grid3X3 className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list'
                ? 'bg-white dark:bg-gray-600 text-blue-500 shadow-sm'
                : 'text-gray-500 dark:text-gray-400'
                }`}
              whileHover={{ scale: 1.05 }}
            >
              <List className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {/* Filter Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Language Filter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <Globe className="w-4 h-4" />
                    Language
                  </label>
                  <Select
                    value={filters.language || "all"}
                    onValueChange={(value) =>
                      onFiltersChange({ language: value === "all" ? "" : value })
                    }
                  >
                    <SelectTrigger className="w-full ">
                      <SelectValue placeholder="All Languages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Languages</SelectItem>
                      {languages.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Category
                  </label>
                  <Select
                    value={filters.category}
                    onValueChange={(value: any) => onFiltersChange({ category: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Font Size */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <Sliders className="w-4 h-4" />
                    Size: {previewSettings.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="72"
                    value={previewSettings.fontSize}
                    onChange={(e) => onPreviewSettingsChange({ fontSize: Number(e.target.value) })}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Text Color */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <Palette className="w-4 h-4" />
                    Text Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={previewSettings.color}
                      onChange={(e) => onPreviewSettingsChange({ color: e.target.value })}
                      className="w-12 h-12 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={previewSettings.color}
                      onChange={(e) => onPreviewSettingsChange({ color: e.target.value })}
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-[#282a2c] border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Preview Text */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Preview Text
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(sampleTexts).map(([lang, sample]) => (
                      <motion.button
                        key={lang}
                        onClick={() => onPreviewSettingsChange({ text: sample })}
                        className="px-3 py-1 text-xs capitalize bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {lang}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={previewSettings.text}
                  onChange={(e) => onPreviewSettingsChange({ text: e.target.value })}
                  placeholder="Type here..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#282a2c] gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows={3}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FilterPanel;