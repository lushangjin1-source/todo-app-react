import React from 'react';
import { motion } from 'framer-motion';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../contexts/LanguageContext';

function ThemeToggle({ theme, onThemeChange }) {
  const { t } = useLanguage();
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    onThemeChange(newTheme);
  };

  return (
    <motion.button 
      onClick={toggleTheme}
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.9 }}
      className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-gray-800/60 to-gray-700/60 hover:from-gray-700/70 hover:to-gray-600/70 text-gray-300 hover:text-white rounded-full transition-all duration-300 border border-gray-600/50 hover:border-gray-500/70 shadow-lg hover:shadow-xl hover:shadow-gray-500/20 relative overflow-hidden group"
      title={`${t('theme.switchTo')}${theme === 'light' ? t('theme.dark') : t('theme.light')}${t('theme.mode')}`}
    >
      <div className="relative z-10">
        {theme === 'light' ? 
          <MoonIcon className="w-5 h-5" /> : 
          <SunIcon className="w-5 h-5" />
        }
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
  );
}

export default ThemeToggle;