import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Globe, Palette, Sliders, Grid3X3, List, X, ChevronLeft, RefreshCw, Book } from 'lucide-react';
import type { FilterOptions, PreviewSettings } from '../../types/font.types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  onClearFilters: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: Partial<FilterOptions>) => void;
  previewSettings: PreviewSettings;
  onPreviewSettingsChange: (settings: Partial<PreviewSettings>) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sampleTexts: Record<string, string>;
}

const Sidebar: React.FC<SidebarProps> = ({
  onClearFilters,
  filters,
  onFiltersChange,
  previewSettings,
  onPreviewSettingsChange,
  viewMode,
  onViewModeChange,
  sampleTexts,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isOpen = !isMobile || (isMobile && true); // always open on desktop

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

  const fontWeights = [
    { value: 100, label: 'Thin (100)' },
    { value: 200, label: 'Extra Light (200)' },
    { value: 300, label: 'Light (300)' },
    { value: 400, label: 'Regular (400)' },
    { value: 500, label: 'Medium (500)' },
    { value: 600, label: 'Semi Bold (600)' },
    { value: 700, label: 'Bold (700)' },
    { value: 800, label: 'Extra Bold (800)' },
    { value: 900, label: 'Black (900)' },
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
    <>
      {/* Sidebar */}
      <motion.div
        className={`fixed lg:relative hidden md:block top-0 left-0 h-full bg-white dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-gray-700 pt-3 z-50 transition-all duration-300 ${isOpen ? 'w-80' : 'w-0'
          } overflow-hidden`}
        initial={false}
        animate={{ width: isOpen ? 320 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className=" py-5.5 px-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between ">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="font-semibold text-gray-900 text-md dark:text-white">Pick Your Typeface</span>


          </div>
          <Button onClick={onClearFilters}>Reset All</Button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-4 space-y-6 overflow-y-auto h-full pb-20"
            >
              {/* Active Filters */}
{activeFilters.length > 0 && (
  <motion.div 
    initial={{ opacity: 0, y: -10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -10, scale: 0.95 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="relative"
  >
    {/* Background with subtle gradient */}
    <div className="absolute inset-0 bg-white dark:bg-[#0a0a0a] rounded-2xl blur-xl"></div>
    
    <div className="relative bg-white/80 dark:bg-[#0a0a0a] backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/40 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wide">
            Active Filters
          </h3>
          <div className="px-2 py-0.5 bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
            {activeFilters.length}
          </div>
        </div>
        
        {/* Clear All Button */}
        <motion.button
          onClick={onClearFilters}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <X className="w-3 h-3" />
          Clear All
        </motion.button>
      </div>

      {/* Filter Tags */}
      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter: any, index: number) => (
          <motion.div
            key={filter.type}
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.05,
              ease: "easeOut" 
            }}
            whileHover={{ scale: 1.02, y: -1 }}
            className="group relative"
          >
            {/* Tag Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 dark:from-blue-500/20 dark:to-indigo-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Main Tag */}
            <div className="relative flex items-center gap-2 px-4 py-2 bg-[#f9fafb] dark:bg-[#1c1c1c] rounded-full shadow-sm backdrop-blur-sm">
              {/* Filter Type Icon */}
              <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              
              {/* Filter Label */}
              <span className="text-sm font-medium text-black dark:text-white select-none">
                {filter.label}
              </span>
              
              {/* Remove Button */}
              <motion.button
                onClick={() => clearFilter(filter.type)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center justify-center w-5 h-5 text-blue-600 dark:text-blue-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-white/80 dark:hover:bg-gray-700/50 rounded-full transition-all duration-200 ml-1"
                aria-label={`Remove ${filter.label} filter`}
              >
                <X className="w-3 h-3" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Subtle bottom accent */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent rounded-full"></div>
    </div>
  </motion.div>
)}

              {/* Preview Text */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Preview Text
                  </label>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">

                </div>
                <textarea
                  value={previewSettings.text}
                  onChange={(e) => onPreviewSettingsChange({ text: e.target.value })}
                  placeholder="Type here..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#282a2c] border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows={3}
                />
              </div>

              {/* View Mode Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  View Mode
                </label>
                <div className="flex bg-gray-100 dark:bg-[#282a2c] rounded-xl p-1">
                  <motion.button
                    onClick={() => onViewModeChange('grid')}
                    className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg transition-all ${viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-300 text-black dark:text-black shadow-sm'
                      : 'text-gray-500 dark:text-gray-400'
                      }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Grid3X3 className="w-4 h-4" />
                    <span className="text-sm">Grid</span>
                  </motion.button>
                  <motion.button
                    onClick={() => onViewModeChange('list')}
                    className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg transition-all ${viewMode === 'list'
                      ? 'bg-white dark:bg-gray-300 text-black dark:text-black shadow-sm'
                      : 'text-gray-500 dark:text-gray-400'
                      }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <List className="w-4 h-4" />
                    <span className="text-sm">List</span>
                  </motion.button>
                </div>
              </div>

              {/* Language Filter */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <Globe className="w-4 h-4" />
                  Language
                </label>
                <Select
                  value={filters.language || "all"}
                  onValueChange={(value) => {
                    onFiltersChange({ language: value === "all" ? "" : value });

                    // Clear preview text when "all" is selected
                    if (value === "all") {
                      onPreviewSettingsChange({ text: "" });
                    }
                  }}
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
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <Book className="w-4 h-4" />
                  Category
                </label>
                <Select
                  value={filters.category}
                  onValueChange={(value: any) => onFiltersChange({ category: value === "all" ? "" : value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue className='text-white' placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Category</SelectItem>
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
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>12px</span>
                  <span>72px</span>
                </div>
              </div>

              {/* Font Weight */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Font Weight
                </label>
                <Select
                  value={String(previewSettings.fontWeight)}
                  onValueChange={(value) => onPreviewSettingsChange({ fontWeight: Number(value) })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select font weight" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontWeights.map(({ value, label }) => (
                      <SelectItem key={value} value={String(value)}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}

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
                  <input
                    type="text"
                    value={previewSettings.color}
                    onChange={(e) => onPreviewSettingsChange({ color: e.target.value })}
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-[#282a2c] border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>


            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default Sidebar;