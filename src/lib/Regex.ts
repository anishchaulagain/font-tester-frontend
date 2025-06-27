// Enhanced function to check if text has complex scripts that might be unsupported
export const hasComplexScripts = (text: string): boolean => {
    // Check for various Unicode ranges that might not be supported by all fonts
    const complexScriptRanges = [
        /[\u0900-\u097F]/, // Devanagari
        /[\u0980-\u09FF]/, // Bengali
        /[\u0A00-\u0A7F]/, // Gurmukhi
        /[\u0A80-\u0AFF]/, // Gujarati
        /[\u0B00-\u0B7F]/, // Oriya
        /[\u0B80-\u0BFF]/, // Tamil
        /[\u0C00-\u0C7F]/, // Telugu
        /[\u0C80-\u0CFF]/, // Kannada
        /[\u0D00-\u0D7F]/, // Malayalam
        /[\u0D80-\u0DFF]/, // Sinhala
        /[\u0E00-\u0E7F]/, // Thai
        /[\u0E80-\u0EFF]/, // Lao
        /[\u1000-\u109F]/, // Myanmar
        /[\u10A0-\u10FF]/, // Georgian
        /[\u1100-\u11FF]/, // Hangul Jamo
        /[\u1200-\u137F]/, // Ethiopic
        /[\u13A0-\u13FF]/, // Cherokee
        /[\u1400-\u167F]/, // Canadian Aboriginal
        /[\u1680-\u169F]/, // Ogham
        /[\u16A0-\u16FF]/, // Runic
        /[\u1700-\u171F]/, // Tagalog
        /[\u1720-\u173F]/, // Hanunoo
        /[\u1740-\u175F]/, // Buhid
        /[\u1760-\u177F]/, // Tagbanwa
        /[\u1780-\u17FF]/, // Khmer
        /[\u1800-\u18AF]/, // Mongolian
        /[\u1900-\u194F]/, // Limbu
        /[\u1950-\u197F]/, // Tai Le
        /[\u1980-\u19DF]/, // New Tai Lue
        /[\u19E0-\u19FF]/, // Khmer Symbols
        /[\u1A00-\u1A1F]/, // Buginese
        /[\u1B00-\u1B7F]/, // Balinese
        /[\u1B80-\u1BBF]/, // Sundanese
        /[\u1C00-\u1C4F]/, // Lepcha
        /[\u1C50-\u1C7F]/, // Ol Chiki
        /[\u1CD0-\u1CFF]/, // Vedic Extensions
        /[\u1D00-\u1D7F]/, // Phonetic Extensions
        /[\u1D80-\u1DBF]/, // Phonetic Extensions Supplement
        /[\u1DC0-\u1DFF]/, // Combining Diacritical Marks Supplement
        /[\u1E00-\u1EFF]/, // Latin Extended Additional
        /[\u1F00-\u1FFF]/, // Greek Extended
        /[\u2000-\u206F]/, // General Punctuation
        /[\u2070-\u209F]/, // Superscripts and Subscripts
        /[\u20A0-\u20CF]/, // Currency Symbols
        /[\u20D0-\u20FF]/, // Combining Diacritical Marks for Symbols
        /[\u2100-\u214F]/, // Letterlike Symbols
        /[\u2150-\u218F]/, // Number Forms
        /[\u2190-\u21FF]/, // Arrows
        /[\u2200-\u22FF]/, // Mathematical Operators
        /[\u2300-\u23FF]/, // Miscellaneous Technical
        /[\u2400-\u243F]/, // Control Pictures
        /[\u2440-\u245F]/, // Optical Character Recognition
        /[\u2460-\u24FF]/, // Enclosed Alphanumerics
        /[\u2500-\u257F]/, // Box Drawing
        /[\u2580-\u259F]/, // Block Elements
        /[\u25A0-\u25FF]/, // Geometric Shapes
        /[\u2600-\u26FF]/, // Miscellaneous Symbols
        /[\u2700-\u27BF]/, // Dingbats
        /[\u27C0-\u27EF]/, // Miscellaneous Mathematical Symbols-A
        /[\u27F0-\u27FF]/, // Supplemental Arrows-A
        /[\u2800-\u28FF]/, // Braille Patterns
        /[\u2900-\u297F]/, // Supplemental Arrows-B
        /[\u2980-\u29FF]/, // Miscellaneous Mathematical Symbols-B
        /[\u2A00-\u2AFF]/, // Supplemental Mathematical Operators
        /[\u2B00-\u2BFF]/, // Miscellaneous Symbols and Arrows
        /[\u2C00-\u2C5F]/, // Glagolitic
        /[\u2C60-\u2C7F]/, // Latin Extended-C
        /[\u2C80-\u2CFF]/, // Coptic
        /[\u2D00-\u2D2F]/, // Georgian Supplement
        /[\u2D30-\u2D7F]/, // Tifinagh
        /[\u2D80-\u2DDF]/, // Ethiopic Extended
        /[\u2DE0-\u2DFF]/, // Cyrillic Extended-A
        /[\u2E00-\u2E7F]/, // Supplemental Punctuation
        /[\u2E80-\u2EFF]/, // CJK Radicals Supplement
        /[\u2F00-\u2FDF]/, // Kangxi Radicals
        /[\u2FF0-\u2FFF]/, // Ideographic Description Characters
        /[\u3000-\u303F]/, // CJK Symbols and Punctuation
        /[\u3040-\u309F]/, // Hiragana
        /[\u30A0-\u30FF]/, // Katakana
        /[\u3100-\u312F]/, // Bopomofo
        /[\u3130-\u318F]/, // Hangul Compatibility Jamo
        /[\u3190-\u319F]/, // Kanbun
        /[\u31A0-\u31BF]/, // Bopomofo Extended
        /[\u31C0-\u31EF]/, // CJK Strokes
        /[\u31F0-\u31FF]/, // Katakana Phonetic Extensions
        /[\u3200-\u32FF]/, // Enclosed CJK Letters and Months
        /[\u3300-\u33FF]/, // CJK Compatibility
        /[\u3400-\u4DBF]/, // CJK Unified Ideographs Extension A
        /[\u4DC0-\u4DFF]/, // Yijing Hexagram Symbols
        /[\u4E00-\u9FFF]/, // CJK Unified Ideographs
        /[\uA000-\uA48F]/, // Yi Syllables
        /[\uA490-\uA4CF]/, // Yi Radicals
        /[\uA500-\uA63F]/, // Vai
        /[\uA640-\uA69F]/, // Cyrillic Extended-B
        /[\uA6A0-\uA6FF]/, // Bamum
        /[\uA700-\uA71F]/, // Modifier Tone Letters
        /[\uA720-\uA7FF]/, // Latin Extended-D
        /[\uA800-\uA82F]/, // Syloti Nagri
        /[\uA830-\uA83F]/, // Common Indic Number Forms
        /[\uA840-\uA87F]/, // Phags-pa
        /[\uA880-\uA8DF]/, // Saurashtra
        /[\uA8E0-\uA8FF]/, // Devanagari Extended
        /[\uA900-\uA92F]/, // Kayah Li
        /[\uA930-\uA95F]/, // Rejang
        /[\uA960-\uA97F]/, // Hangul Jamo Extended-A
        /[\uA980-\uA9DF]/, // Javanese
        /[\uAA00-\uAA5F]/, // Cham
        /[\uAA60-\uAA7F]/, // Myanmar Extended-A
        /[\uAA80-\uAADF]/, // Tai Viet
        /[\uAB00-\uAB2F]/, // Ethiopic Extended-A
        /[\uABC0-\uABFF]/, // Meetei Mayek
        /[\uAC00-\uD7AF]/, // Hangul Syllables
        /[\uD800-\uDB7F]/, // High Surrogates
        /[\uDB80-\uDBFF]/, // High Private Use Surrogates
        /[\uDC00-\uDFFF]/, // Low Surrogates
        /[\uE000-\uF8FF]/, // Private Use Area
        /[\uF900-\uFAFF]/, // CJK Compatibility Ideographs
        /[\uFB00-\uFB4F]/, // Alphabetic Presentation Forms
        /[\uFB50-\uFDFF]/, // Arabic Presentation Forms-A
        /[\uFE00-\uFE0F]/, // Variation Selectors
        /[\uFE10-\uFE1F]/, // Vertical Forms
        /[\uFE20-\uFE2F]/, // Combining Half Marks
        /[\uFE30-\uFE4F]/, // CJK Compatibility Forms
        /[\uFE50-\uFE6F]/, // Small Form Variants
        /[\uFE70-\uFEFF]/, // Arabic Presentation Forms-B
        /[\uFF00-\uFFEF]/, // Halfwidth and Fullwidth Forms
        /[\uFFF0-\uFFFF]/, // Specials
        /[\u0590-\u05FF]/, // Hebrew
        /[\u0600-\u06FF]/, // Arabic
        /[\u0700-\u074F]/, // Syriac
        /[\u0750-\u077F]/, // Arabic Supplement
        /[\u0780-\u07BF]/, // Thaana
        /[\u07C0-\u07FF]/, // NKo
        /[\u1EA0-\u1EFF]/, // Vietnamese
    ];

    return complexScriptRanges.some(regex => regex.test(text));
};
