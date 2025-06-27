import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Download, Heart, X, ChevronDown, Eye, Code, Link, AlertTriangle } from 'lucide-react';
import type { Font, PreviewSettings } from '../../types/font.types';
import { doesFontSupportText } from '@/lib/fontSupport';

interface FontCardProps {
    font: Font;
    previewSettings: PreviewSettings;
    viewMode: 'grid' | 'list';
    index: number;
    sampleTexts: Record<string, string>;
    languageToSubset: Record<string, string>;
}

// Font weight options
const FONT_WEIGHTS = [
    { value: 100, label: 'Thin' },
    { value: 400, label: 'Regular' },
    { value: 600, label: 'Semi Bold' },
    { value: 700, label: 'Bold' },
];

const sampleTexts: any = {
    english: "The quick brown fox jumps high",
    nepali: "नेपाल सुन्दर देश हो जसको हिमाल छ।",
    hindi: "यह एक उदाहरण वाक्य है जो समान लंबाई का है।",
    arabic: "هذه جملة نموذجية لاختبار الخط فقط.",
    japanese: "これはフォントのサンプルテキストです。",
    chinese: "这是一段用于字体预览的示例文本。",
    korean: "이것은 글꼴 미리보기용 샘플 문장입니다。",
};

// Language to subset mapping
const languageToSubset: Record<string, string> = {
    english: "latin",
    nepali: "devanagari",
    hindi: "devanagari",
    arabic: "arabic",
    japanese: "japanese",
    chinese: "chinese-simplified",
    korean: "korean"
};

// Improved function to detect unsupported characters
const detectUnsupportedChars = (text: string, fontFamily: string): boolean => {
    // Create a test element to check font rendering
    const testDiv = document.createElement('div');
    testDiv.style.position = 'absolute';
    testDiv.style.visibility = 'hidden';
    testDiv.style.whiteSpace = 'nowrap';
    testDiv.style.fontSize = '72px'; // Larger size for better detection
    testDiv.style.fontFamily = `"${fontFamily}", monospace`; // Use monospace as fallback
    document.body.appendChild(testDiv);

    // Create fallback test element
    const fallbackDiv = document.createElement('div');
    fallbackDiv.style.position = 'absolute';
    fallbackDiv.style.visibility = 'hidden';
    fallbackDiv.style.whiteSpace = 'nowrap';
    fallbackDiv.style.fontSize = '72px';
    fallbackDiv.style.fontFamily = 'monospace';
    document.body.appendChild(fallbackDiv);

    let hasUnsupported = false;

    try {
        for (const char of text) {
            // Skip basic Latin characters, whitespace, and common punctuation
            if (/[\x00-\x7F\s]/.test(char)) continue;

            // Skip characters that are commonly supported
            if (/[.,!?;:()[\]{}'"´`~@#$%^&*+=<>\/\\|_-]/.test(char)) continue;

            // Test the character
            testDiv.textContent = char;
            fallbackDiv.textContent = char;

            const targetWidth = testDiv.offsetWidth;
            const fallbackWidth = fallbackDiv.offsetWidth;

            // If the widths are exactly the same, it might be using fallback
            // Also check if width is 0 or unusually small
            if (targetWidth === fallbackWidth || targetWidth < 10) {
                // Double-check with a different approach
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.font = `72px "${fontFamily}"`;
                    const metrics = ctx.measureText(char);

                    // If text width is 0 or very small, it's likely unsupported
                    if (metrics.width < 5) {
                        hasUnsupported = true;
                        break;
                    }
                }
            }
        }
    } finally {
        document.body.removeChild(testDiv);
        document.body.removeChild(fallbackDiv);
    }

    return hasUnsupported;
};

// Improved function to replace unsupported characters with tofu
const replaceUnsupportedChars = (text: string, fontFamily: string): string => {
    // Create a test element for more accurate detection
    const testSpan = document.createElement('span');
    testSpan.style.position = 'absolute';
    testSpan.style.visibility = 'hidden';
    testSpan.style.fontSize = '72px';
    testSpan.style.fontFamily = `"${fontFamily}", monospace`;
    document.body.appendChild(testSpan);

    const fallbackSpan = document.createElement('span');
    fallbackSpan.style.position = 'absolute';
    fallbackSpan.style.visibility = 'hidden';
    fallbackSpan.style.fontSize = '72px';
    fallbackSpan.style.fontFamily = 'monospace';
    document.body.appendChild(fallbackSpan);

    let result = '';

    try {
        for (const char of text) {
            // Always keep basic Latin characters, whitespace, and common punctuation
            if (/[\x00-\x7F\s]/.test(char)) {
                result += char;
                continue;
            }

            // Skip common punctuation and symbols
            if (/[.,!?;:()[\]{}'"´`~@#$%^&*+=<>\/\\|_-]/.test(char)) {
                result += char;
                continue;
            }

            // Test the character
            testSpan.textContent = char;
            fallbackSpan.textContent = char;

            const targetWidth = testSpan.offsetWidth;
            const fallbackWidth = fallbackSpan.offsetWidth;

            // More sophisticated check
            let isUnsupported = false;

            // Check if widths are exactly the same (might be using fallback)
            if (targetWidth === fallbackWidth) {
                // Use canvas for secondary check
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.font = `72px "${fontFamily}"`;
                    const metrics = ctx.measureText(char);

                    // If canvas also shows very small width, it's likely unsupported
                    if (metrics.width < 5) {
                        isUnsupported = true;
                    }
                }
            }

            // Check if the character renders with 0 or very small width
            if (targetWidth < 10) {
                isUnsupported = true;
            }

            result += isUnsupported ? '⧠' : char;
        }
    } finally {
        document.body.removeChild(testSpan);
        document.body.removeChild(fallbackSpan);
    }

    return result;
};


// Tofu Alert Component
const TofuAlert: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg"
    >
        <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
                <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                    Some characters may not display correctly
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                    This font may not support all the characters in your text. Unsupported characters will appear as boxes (⧠).
                </p>
            </div>
            <button
                onClick={onDismiss}
                className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 p-1"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    </motion.div>
);
// Font Detail Modal Component
const FontDetailModal: React.FC<{
    font: Font;
    isOpen: boolean;
    onClose: () => void;
    previewSettings: PreviewSettings;
    defaultText: string;
}> = ({ font, isOpen, onClose, previewSettings, defaultText }) => {
    const [selectedWeight, setSelectedWeight] = useState(400);
    const [copiedItem, setCopiedItem] = useState('');
    const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'embed'>('preview');
    const [showTofuAlert, setShowTofuAlert] = useState(false);

    const currentText = previewSettings.text?.trim() || defaultText;

    useEffect(() => {
        if (isOpen) {
            const hasUnsupported = detectUnsupportedChars(currentText, font.name);
            setShowTofuAlert(hasUnsupported);
        }
    }, [isOpen, currentText, font.name]);

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopiedItem(type);
        setTimeout(() => setCopiedItem(''), 2000);
    };

    const embedCode = `<link href="${font.google_fonts_url}" rel="stylesheet">`;
    const cssCode = `font-family: '${font.name}', ${font.category};`;
    const cssWithWeight = `font-family: '${font.name}', ${font.category};\nfont-weight: ${selectedWeight};`;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#131314]">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {font.name}
                                </h2>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full capitalize">
                                        {font.category}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {font.subsets.join(', ')}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-4 mt-4">
                            {[
                                { id: 'preview', label: 'Preview', icon: Eye },
                                { id: 'code', label: 'CSS', icon: Code },
                                { id: 'embed', label: 'Embed', icon: Link }
                            ].map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id as any)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === id
                                        ? 'bg-white dark:bg-gray-300 text-black dark:text-black shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] dark:bg-[#131314] bg-white">
                        {activeTab === 'preview' && (
                            <div className="space-y-6">
                                {/* Tofu Alert */}
                                <AnimatePresence>
                                    {showTofuAlert && (
                                        <TofuAlert onDismiss={() => setShowTofuAlert(false)} />
                                    )}
                                </AnimatePresence>

                                {/* Font Weight Selector */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Font Weight
                                    </label>
                                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 ]">
                                        {FONT_WEIGHTS.map((weight) => (
                                            <button
                                                key={weight.value}
                                                onClick={() => setSelectedWeight(weight.value)}
                                                className={`p-3 text-sm rounded-lg border transition-all ${selectedWeight === weight.value
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-[#282a2c]'
                                                    }`}
                                            >
                                                <div className="font-medium">{weight.value}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {weight.label}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Font Preview */}
                                <div className="bg-gray-50 dark:bg-[#131314] rounded-xl p-8">
                                    <div className="space-y-6">
                                        {/* Large Preview */}


                                        {/* Size Variations */}
                                        <div className="space-y-4">
                                            {[48, 36, 24, 18, 14].map((size) => (
                                                <div key={size}>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                        {size}px
                                                    </div>
                                                    <p
                                                        className="text-gray-900 dark:text-white"
                                                        style={{
                                                            fontFamily: `${font.name}, 'Segoe UI', 'Roboto', 'Noto Sans', 'Arial', 'sans-serif'`,
                                                            fontSize: `${size}px`,
                                                            fontWeight: selectedWeight,
                                                            color: previewSettings.color,
                                                        }}
                                                    >
                                                        {replaceUnsupportedChars(currentText, font.name)}
                                                    </p>
                                                    <hr />
                                                </div>

                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'code' && (
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                            CSS Code
                                        </h3>
                                        <button
                                            onClick={() => copyToClipboard(cssWithWeight, 'css')}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-[#282a2c] text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                                        >
                                            {copiedItem === 'css' ? (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4" />
                                                    Copy CSS
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <div className="bg-[#f9fafb]  dark:bg-[#282a2c] rounded-lg p-4 overflow-x-auto">
                                        <pre className="text-black dark:text-green-400  text-sm">
                                            <code>{cssWithWeight}</code>
                                        </pre>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    <p className="mb-2">Usage:</p>
                                    <div className="bg-[#f9fafb]  dark:bg-[#282a2c] rounded-lg p-3">
                                        <code className="text-sm">
                                            .my-text {`{`}<br />
                                            &nbsp;&nbsp;{cssWithWeight.split('\n').join(';\n  ')}<br />
                                            {`}`}
                                        </code>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'embed' && (
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                            HTML Embed Code
                                        </h3>
                                        <button
                                            onClick={() => copyToClipboard(embedCode, 'embed')}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-[#282a2c] text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                                        >
                                            {copiedItem === 'embed' ? (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4" />
                                                    Copy Embed
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <div className="bg-[#f9fafb]  dark:bg-[#282a2c] rounded-lg p-4 overflow-x-auto">
                                        <pre className="dark:text-green-400 text-black  text-sm">
                                            <code>{embedCode}</code>
                                        </pre>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    <p className="mb-2">Instructions:</p>
                                    <ol className="list-decimal list-inside space-y-1 ml-4">
                                        <li>Copy the embed code above</li>
                                        <li>Paste it in the &lt;head&gt; section of your HTML</li>
                                        <li>Use the CSS code from the "CSS" tab to apply the font</li>
                                    </ol>
                                </div>

                                <div className="bg-[#f9fafb]  dark:bg-[#282a2c] rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                        Complete Example:
                                    </h4>
                                    <pre className="text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">
                                        {`<!DOCTYPE html>
<html>
  <head>
    ${embedCode}
    <style>
      .my-font {
        ${cssWithWeight.split('\n').join(';\n        ')};
      }
    </style>
  </head>
  <body>
    <p class="my-font">Your text here</p>
  </body>
</html>`}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const FontCard: React.FC<FontCardProps> = ({ font, previewSettings, viewMode, index }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedWeight, setSelectedWeight] = useState(previewSettings.fontWeight || 400);
    const [showTofuAlert, setShowTofuAlert] = useState(false);

    const matchedLanguage = Object.keys(languageToSubset).find(
        (lang) => font.subsets.includes(languageToSubset[lang])
    );

    const defaultText = matchedLanguage ? sampleTexts[matchedLanguage] : previewSettings.text;
    const currentText = previewSettings.text?.trim() || defaultText;

    const [hasUnsupportedGlyphs, setHasUnsupportedGlyphs] = useState(false);

    useEffect(() => {
        const text = previewSettings.text?.trim() || defaultText;
        const supported = doesFontSupportText(text, font.name);
        setHasUnsupportedGlyphs(!supported);

        
        const hasUnsupported = detectUnsupportedChars(text, font.name);
        setShowTofuAlert(hasUnsupported);
    }, [previewSettings.text, font.name, defaultText]);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`group bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:shadow-gray-900/5 dark:hover:shadow-gray-900/20 transition-all duration-300 cursor-pointer ${viewMode === 'list' ? 'p-4' : 'p-6'
                    }`}
                whileHover={{ y: -2 }}
                onClick={() => setIsModalOpen(true)}
            >
                {/* Tofu Alert for Card */}
                <AnimatePresence>
                    {showTofuAlert && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-3 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg"
                        >
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                                <p className="text-xs text-amber-700 dark:text-amber-300">
                                    Some characters may not be supported by this font
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Font Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-gray-900 dark:text-white truncate ${viewMode === 'list' ? 'text-lg' : 'text-xl'
                            }`}>
                            {font.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md capitalize">
                                {font.category}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {font.subsets.slice(0, 2).join(', ')}
                                {font.subsets.length > 2 && ` +${font.subsets.length - 2} more`}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsLiked(!isLiked);
                            }}
                            className={`p-2 rounded-lg transition-colors ${isLiked
                                ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Add to favorites"
                        >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        </motion.button>


                    </div>
                </div>



                {/* Font Preview */}
                <div className={`bg-gray-50 dark:bg-[#0a0a0a] rounded-xl transition-all duration-300 ${viewMode === 'list' ? 'p-4' : 'p-6'
                    } w-full`}>
                    <p
                        className="leading-relaxed transition-all duration-300"
                        style={{
                            fontFamily: `${font.name}, 'Segoe UI', 'Roboto', 'Noto Sans', 'Arial', 'sans-serif'`,
                            color: previewSettings.color,
                            fontSize: `${viewMode === 'list' ? Math.min(previewSettings.fontSize, 32) : previewSettings.fontSize}px`,
                            fontWeight: selectedWeight,
                        }}
                    >
                        {replaceUnsupportedChars(currentText, font.name)}
                    </p>
                </div>

                {/* Font Info */}
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                        <span>Google Fonts</span>
                        {font.createdAt && (
                            <span>Added {new Date(font.createdAt).toLocaleDateString()}</span>
                        )}
                    </div>
                    <span>{previewSettings.fontSize}px • {selectedWeight}</span>
                </div>

                {/* Click to view hint */}
                <div className="mt-3 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                        Click to view details and get code
                    </span>
                </div>
            </motion.div>

            {/* Font Detail Modal */}
            <FontDetailModal
                font={font}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                previewSettings={previewSettings}
                defaultText={defaultText}
            />
        </>
    );
};

export default FontCard;