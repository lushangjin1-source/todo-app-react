import React from 'react'
import { motion } from 'framer-motion'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { useLanguage } from '../contexts/LanguageContext'

const LanguageToggle = ({ className = '' }) => {
  const { language, changeLanguage, isZh } = useLanguage()

  const toggleLanguage = () => {
    changeLanguage(isZh ? 'en' : 'zh')
  }

  return (
    <motion.button
      onClick={toggleLanguage}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white transition-all duration-200 backdrop-blur-sm ${className}`}
      title={isZh ? '切换到英文' : 'Switch to Chinese'}
    >
      <GlobeAltIcon className="w-4 h-4" />
      <span className="text-sm font-medium">
        {isZh ? '中' : 'EN'}
      </span>
    </motion.button>
  )
}

export default LanguageToggle