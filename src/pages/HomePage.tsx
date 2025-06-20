import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Type,
    Palette,
    Globe,
    Copy,
    Download,
    Sun,
    Moon,
    Filter,
    Grid3X3,
    List,
    Sliders
} from "lucide-react";
import { mockFonts } from "../mockFonts/mockFonts";

const Homepage = () => {
    const [query, setQuery] = useState("");
    const [color, setColor] = useState("#1f2937");
    const [lang, setLang] = useState("");
    const [text, setText] = useState("The quick brown fox jumps over the lazy dog");
    const [isDark, setIsDark] = useState(false);
    const [viewMode, setViewMode] = useState("grid"); // grid or list
    const [fontSize, setFontSize] = useState(24);
    const [fontWeight, setFontWeight] = useState(400);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Inject font links dynamically
    useEffect(() => {
        mockFonts.forEach((font) => {
            const exists = document.querySelector(`link[href="${font.google_fonts_url}"]`);
            if (!exists) {
                const link = document.createElement("link");
                link.href = font.google_fonts_url;
                link.rel = "stylesheet";
                document.head.appendChild(link);
            }
        });
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
    }, [isDark]);

    const filteredFonts = mockFonts.filter((font) =>
        font.name.toLowerCase().includes(query.toLowerCase()) &&
        (lang === "" || font.subsets.includes(lang))
    );

    const sampleTexts = [
        "The quick brown fox jumps over the lazy dog",
        "Typography is the art of arranging type",
        "Design is not just what it looks like",
        "Good typography is invisible",
        "Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm"
    ];

    const copyToClipboard = (fontName: any) => {
        navigator.clipboard.writeText(`font-family: '${fontName}', sans-serif;`);
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'}`}>
            {/* Header */}
            <motion.header
                className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <motion.div
                            className="flex items-center space-x-3"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center">
                                <Type className="w-6 h-6 text-white dark:text-slate-900" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">TypeTester</h1>

                            </div>
                        </motion.div>

                        <div className="flex items-center space-x-4">
                            <motion.button
                                onClick={() => setIsDark(!isDark)}
                                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Control Panel */}
                <motion.div
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8 shadow-lg shadow-gray-900/5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    {/* Search and View Controls */}
                    <div className="flex flex-col lg:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search fonts by name..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <motion.button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`px-4 py-3 rounded-xl border transition-all flex items-center gap-2 ${isFilterOpen
                                        ? 'bg-blue-500 text-white border-blue-500'
                                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                    }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Filter className="w-5 h-5" />
                                <span className="hidden sm:inline">Filters</span>
                            </motion.button>

                            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                                <motion.button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-lg transition-all ${viewMode === "grid"
                                            ? 'bg-white dark:bg-gray-600 text-blue-500 shadow-sm'
                                            : 'text-gray-500 dark:text-gray-400'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-lg transition-all ${viewMode === "list"
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

                    {/* Advanced Filters */}
                    <AnimatePresence>
                        {isFilterOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                    {/* Language Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <Globe className="w-4 h-4 inline mr-1" />
                                            Language
                                        </label>
                                        <select
                                            value={lang}
                                            onChange={(e) => setLang(e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">All Languages</option>
                                            <option value="latin">Latin</option>
                                            <option value="cyrillic">Cyrillic</option>
                                            <option value="devanagari">Devanagari</option>
                                            <option value="greek">Greek</option>
                                        </select>
                                    </div>

                                    {/* Color Picker */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <Palette className="w-4 h-4 inline mr-1" />
                                            Text Color
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={color}
                                                onChange={(e) => setColor(e.target.value)}
                                                className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={color}
                                                onChange={(e) => setColor(e.target.value)}
                                                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Font Size */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <Sliders className="w-4 h-4 inline mr-1" />
                                            Size: {fontSize}px
                                        </label>
                                        <input
                                            type="range"
                                            min="12"
                                            max="72"
                                            value={fontSize}
                                            onChange={(e) => setFontSize(Number(e.target.value))}
                                            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                                        />
                                    </div>

                                    {/* Font Weight */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Weight
                                        </label>
                                        <select
                                            value={fontWeight}
                                            onChange={(e) => setFontWeight(Number(e.target.value))}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value={300}>Light (300)</option>
                                            <option value={400}>Regular (400)</option>
                                            <option value={500}>Medium (500)</option>
                                            <option value={600}>Semi Bold (600)</option>
                                            <option value={700}>Bold (700)</option>
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Text Input */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Preview Text
                            </label>
                            <div className="flex gap-2">
                                {sampleTexts.slice(0, 3).map((sample, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => setText(sample)}
                                        className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Sample {index + 1}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Type your text here to preview with different fonts..."
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            rows={3}
                        />
                    </div>
                </motion.div>

                {/* Results Header */}
                <motion.div
                    className="flex items-center justify-between mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Font Results
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {filteredFonts.length} fonts found
                        </p>
                    </div>
                </motion.div>

                {/* Font Grid/List */}
                <motion.div
                    className={`grid gap-6 ${viewMode === "grid"
                            ? "grid-cols-1 lg:grid-cols-2"
                            : "grid-cols-1"
                        }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <AnimatePresence>
                        {filteredFonts.map((font, index) => (
                            <motion.div
                                key={font.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:shadow-gray-900/10 dark:hover:shadow-gray-900/30 transition-all duration-300"
                                whileHover={{ y: -2 }}
                            >
                                {/* Font Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {font.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {font.subsets.join(", ")}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <motion.button
                                            onClick={() => copyToClipboard(font.name)}
                                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            title="Copy CSS"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </motion.button>
                                        <motion.button
                                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            title="Download"
                                        >
                                            <Download className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Font Preview */}
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                                    <p
                                        className="leading-relaxed transition-all duration-300"
                                        style={{
                                            fontFamily: font.name,
                                            color: color,
                                            fontSize: `${fontSize}px`,
                                            fontWeight: fontWeight
                                        }}
                                    >
                                        {text}
                                    </p>
                                </div>

                                {/* Font Info */}
                                <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                    <span>Google Fonts</span>
                                    <span>{fontSize}px • {fontWeight}</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {filteredFonts.length === 0 && (
                    <motion.div
                        className="text-center py-16"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No fonts found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Try adjusting your search criteria or filters
                        </p>
                        <motion.button
                            onClick={() => {
                                setQuery("");
                                setLang("");
                            }}
                            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Clear Filters
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Homepage;