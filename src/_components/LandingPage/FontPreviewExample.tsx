import  { useState } from 'react';
import {AnimatePresence, motion} from 'framer-motion'


const FontPreviewDemo = () => {
   const [activeFont, setActiveFont] = useState(0);
   const sampleFonts = [
    { name: 'Inter', className: 'font-sans' },
    { name: 'Playfair Display', className: 'font-serif' },
    { name: 'JetBrains Mono', className: 'font-mono' },
    { name: 'Poppins', className: 'font-sans' }
  ];

  return (
    <section className="py-20 px-6 bg-gray-50 dark:bg-[#131314]">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              See Fonts in Action
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Experience real-time font previewing with our interactive demo
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-wrap gap-4 mb-8">
                {sampleFonts.map((font, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setActiveFont(index)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeFont === index
                        ? 'bg-black dark:bg-gradient-to-br dark:from-purple-500 dark:to-pink-500 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {font.name}
                  </motion.button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFont}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`${sampleFonts[activeFont].className} space-y-6`}
                >
                  <h3 className="text-4xl font-bold text-gray-900 dark:text-white">
                    The quick brown fox jumps over the lazy dog
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    Typography is the art and technique of arranging type to make written language 
                    legible, readable, and appealing when displayed. Great typography can transform 
                    your design from good to extraordinary.
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Font: {sampleFonts[activeFont].name} • Size: 16px • Weight: Regular
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

  );
};

export default FontPreviewDemo;