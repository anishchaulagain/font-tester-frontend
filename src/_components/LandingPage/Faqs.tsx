import React from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    question: "Bonus tip: Terminologies we frequently use on fonts",
    answer: `
**Foundry** – People who create the font  
**Glyphs** – An individual character unit of a font (e.g., a, b, c, $, *)  
**Typographic Features** – What features a font supports (e.g., Ligatures, often used in IDEs)  
**Visual Properties** – Visual attributes of fonts like weight, contrast, width
    `
  },
  // Add more FAQs here later if needed
]

export const Faq = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0)

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">FAQ</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <button
              className="w-full flex justify-between items-center px-4 py-3 text-left bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={() => toggle(index)}
            >
              <span className="font-medium text-gray-800 dark:text-gray-100">{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-600 dark:text-gray-300 transform transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-4 py-3 text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}
