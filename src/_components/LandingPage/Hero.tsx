import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react';
import TypedAnimation from '../TypedAnimation';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.6
    }
  }
};

const itemVariants: any = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const Hero = () => {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/homepage')
  }
  return (
    <motion.section
      className="pt-20 pb-32 px-6 bg-white dark:bg-slate-900"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium mb-8"
            variants={itemVariants}
          >
            <span className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full mr-2"></span>
            Professional Typography Testing
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight"
            variants={itemVariants}
          >
            Perfect Your
            <span className="block bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              <TypedAnimation />
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Test fonts, colors, and layouts in real-time. Create beautiful typography combinations with our intuitive testing environment.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            <motion.button onClick={handleClick}
              className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span >Start Testing</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              className="px-8 py-4 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-colors"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              View Demo
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
export default Hero