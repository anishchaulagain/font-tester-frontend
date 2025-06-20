import {motion } from 'framer-motion'

const CTA = () => {
  return (
  <motion.section 
        className="py-20 px-6 bg-slate-900 dark:bg-slate-950"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white dark:text-white mb-6"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to Perfect Your Typography?
          </motion.h2>
          <motion.p 
            className="text-xl text-slate-300 dark:text-slate-400 mb-8"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Join thousands of designers who trust TypeTester for their typography needs.
          </motion.p>
          <motion.button 
            className="px-10 py-4 bg-white dark:bg-slate-100 text-slate-900 dark:text-slate-900 rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-white transition-colors"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Get Started Free
          </motion.button>
        </div>
      </motion.section>
  )
}

export default CTA