import { useState, useEffect, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Components
import Header from '../_components/Homepage/Header';
import SearchBar from '../_components/Homepage/Searchbar';
import FontCard from '../_components/Homepage/FontCard';
import EmptyState from '../_components/Homepage/EmptyState';
import FontCardSkeleton from '@/_components/Loader';
import Sidebar from '@/_components/Homepage/Sidebar';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

// Types
import type { Font, FilterOptions, PreviewSettings } from '../types/font.types';
import axios from 'axios';

const TestHomepageData = () => {
  const sampleTexts = {
    english: "The quick brown fox jumps high",
    nepali: "नेपाल एक सुन्दर देश हो।",
    hindi: "सुंदर फूल बग़ीचे में खिलते हैं।",
    arabic: "هذه فقرة تجريبية.",
    japanese: "これはサンプルテキストです。",
    chinese: "这是一段示例文字。段示例文字",
    korean: "이것은 샘플 텍스트입니다。"
  };

  const languageToSubset: any = {
    english: "latin",
    nepali: "devanagari",
    hindi: "devanagari",
    arabic: "arabic",
    japanese: "japanese",
    chinese: "chinese-simplified",
    korean: "korean"
  };

  const [fonts, setFonts] = useState<Font[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const [filters, setFilters] = useState<FilterOptions>({ query: '', language: '', category: '', sortBy: 'name' });
  const [previewSettings, setPreviewSettings] = useState<PreviewSettings>({
    text: '',
    fontSize: 32,
    fontWeight: 400,
    color: theme === 'dark' ? '#ffffff' : '#000000'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const fontsPerPage = 6;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlFilters: Partial<FilterOptions> = {};
    const urlPreviewSettings: Partial<PreviewSettings> = {};
    if (params.get('query')) urlFilters.query = params.get('query')!;
    if (params.get('language')) urlFilters.language = params.get('language')!;
    if (params.get('category')) urlFilters.category = params.get('category')!;
    if (params.get('sortBy')) urlFilters.sortBy = params.get('sortBy') as FilterOptions['sortBy'];
    if (params.get('text')) urlPreviewSettings.text = decodeURIComponent(params.get('text')!);
    if (params.get('fontSize')) urlPreviewSettings.fontSize = Number(params.get('fontSize'));
    if (params.get('fontWeight')) urlPreviewSettings.fontWeight = Number(params.get('fontWeight'));
    if (params.get('color')) urlPreviewSettings.color = params.get('color')!;
    if (params.get('viewMode')) setViewMode(params.get('viewMode') as 'grid' | 'list');
    if (params.get('page')) setCurrentPage(Number(params.get('page')));
    setFilters(prev => ({ ...prev, ...urlFilters }));
    setPreviewSettings(prev => ({ ...prev, ...urlPreviewSettings }));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.query) params.set('query', filters.query);
    if (filters.language) params.set('language', filters.language);
    if (filters.category) params.set('category', filters.category);
    if (filters.sortBy !== 'name') params.set('sortBy', filters.sortBy);
    if (previewSettings.text !== sampleTexts.nepali) params.set('text', encodeURIComponent(previewSettings.text));
    if (previewSettings.fontSize !== 32) params.set('fontSize', previewSettings.fontSize.toString());
    if (previewSettings.fontWeight !== 400) params.set('fontWeight', previewSettings.fontWeight.toString());
    if (previewSettings.color !== '#1f2937') params.set('color', previewSettings.color);
    if (viewMode !== 'grid') params.set('viewMode', viewMode);
    if (currentPage !== 1) params.set('page', currentPage.toString());
    const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }, [filters, previewSettings, viewMode, currentPage]);

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/v1/fonts");
        setFonts(response.data.data);
      } catch (error) {
        console.error("Error fetching fonts:", error);
      }
    };
    fetchFonts();
  }, []);

  useEffect(() => {
    fonts.forEach((font) => {
      if (!document.querySelector(`link[href="${font.google_fonts_url}"]`)) {
        const link = document.createElement("link");
        link.href = font.google_fonts_url;
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
    });
  }, [fonts]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    setPreviewSettings(prev => ({ ...prev, color: theme === 'dark' ? '#ffffff' : '#000000' }));
  }, [theme]);

  useEffect(() => {
    if (filters.language && sampleTexts[filters.language as keyof typeof sampleTexts]) {
      setPreviewSettings(prev => ({ ...prev, text: sampleTexts[filters.language as keyof typeof sampleTexts] }));
    }
  }, [filters.language]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const filteredFonts = fonts.filter((font) => {
    const matchesQuery = font.name.toLowerCase().includes(filters.query.toLowerCase());
    const selectedSubset = languageToSubset[filters.language] || '';
    const matchesLanguage = !filters.language || font.subsets.includes(selectedSubset);
    const matchesCategory = !filters.category || font.category === filters.category;
    return matchesQuery && matchesLanguage && matchesCategory;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'recent': return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      case 'trending': return Math.random() - 0.5;
      default: return 0;
    }
  });

  const totalPages = Math.ceil(filteredFonts.length / fontsPerPage);
  const paginatedFonts = filteredFonts.slice((currentPage - 1) * fontsPerPage, currentPage * fontsPerPage);

  const handleFiltersChange = (newFilters: Partial<FilterOptions>) => setFilters(prev => ({ ...prev, ...newFilters }));
  const handlePreviewSettingsChange = (newSettings: Partial<PreviewSettings>) => setPreviewSettings(prev => ({ ...prev, ...newSettings }));

  const clearAllFilters = () => {
    setFilters({ query: '', language: '', category: '', sortBy: 'name' });
    setPreviewSettings(prev => ({ ...prev, text: "" }));
  };

  return (
    <div className="min-h-screen dark:bg-[#0a0a0a] bg-[#fafafa] duration-300 flex">
      <Sidebar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        previewSettings={previewSettings}
        onPreviewSettingsChange={handlePreviewSettingsChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sampleTexts={sampleTexts}
        onClearFilters={clearAllFilters}
      />

      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <Header isDark={isDark} onToggleDark={() => setIsDark(!isDark)} />

        {/* Main Content */}
        <div className="w-full px-6 py-8 space-y-6">
          <SearchBar filters={filters} onFiltersChange={handleFiltersChange} resultsCount={filteredFonts.length} />
          {paginatedFonts.length > 0 ? (
            <>
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                <AnimatePresence mode="wait">
                  {paginatedFonts.map((font, index) => (
                    <Suspense fallback={<FontCardSkeleton />} key={font.id}>
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                        <FontCard
                          font={font}
                          previewSettings={previewSettings}
                          viewMode={viewMode}
                          index={index}
                          sampleTexts={sampleTexts}
                          languageToSubset={languageToSubset}

                        />
                      </motion.div>
                    </Suspense>
                  ))}
                </AnimatePresence>
              </div>
              <div className="flex justify-center mt-8 gap-2 items-center flex-wrap">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === 1
                    ? 'bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${page === currentPage
                      ? 'dark:bg-white text-white bg-gray-600 dark:text-black'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center min-h-[60vh]">
              <EmptyState onClearFilters={clearAllFilters} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TestHomepage = () => (
  <ThemeProvider>
    <TestHomepageData />
  </ThemeProvider>
);

export default TestHomepage;
