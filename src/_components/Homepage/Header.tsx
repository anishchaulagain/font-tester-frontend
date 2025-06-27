import React from 'react';
import { motion } from 'framer-motion';
import { Type} from 'lucide-react';
import ThemeToggle from '../ThemeToggler';
import {  useNavigate } from 'react-router-dom';

interface HeaderProps {
    isDark: boolean;
    onToggleDark: () => void;
}

const Header: React.FC<HeaderProps> = ({  onToggleDark }) => {
    const navigate = useNavigate()
    const handleLogoClick = () =>{
         navigate('/')
    }
    return (
        <motion.header
            className=" top-0 z-50 backdrop-blur-md bg-white/95 dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-700 shadow-sm"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <div className="max-w-[1400px] mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <motion.div
                        className="flex items-center space-x-4 cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center">
                            <Type className="w-6 h-6 text-white dark:text-slate-900" />
                        </div>
                        <div onClick={handleLogoClick}>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">TypeTester</h1>
            
                        </div>
                    </motion.div>

                    <div className="flex items-center space-x-4  r">
                        <motion.button
                            onClick={onToggleDark}
                            className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        > 
                             <ThemeToggle/>
                          
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.header>
    );
};

export default Header;