
import {motion } from 'framer-motion'
import { Eye, Palette, Type, Zap } from "lucide-react";

const FeatureSection = () => {

  
  const features = [
    {
      icon: Type,
      title: "Live Preview",
      description: "See your text transform instantly as you change fonts"
    },
    {
      icon: Palette,
      title: "Color Testing",
      description: "Experiment with colors and contrast ratios"
    },
     {
      icon: Eye,
      title: 'Multiple View Modes',
      description: 'Preview fonts in different contexts - headers, body text, and special layouts.'
    },
    {
      icon: Zap,
      title: "Fast & Responsive",
      description: "Smooth performance across all devices"
    }
  ];

  return (
    <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Font Testing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need to make perfect typography decisions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

  )
}

export default FeatureSection