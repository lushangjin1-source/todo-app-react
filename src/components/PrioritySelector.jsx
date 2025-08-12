import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon, ExclamationCircleIcon, MinusCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useLanguage } from '../contexts/LanguageContext'

function PrioritySelector({ priority, onPriorityChange, size = 'normal', readOnly = false, todos = [] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(null)
  const { t } = useLanguage()

  // 获取指定优先级的最近3个待办事项
  const getRecentTodosByPriority = (priorityValue) => {
    return todos
      .filter(todo => todo.priority === priorityValue && !todo.completed)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3)
  }

  const priorities = [
    { 
      value: 'low', 
      label: t('priority.low'), 
      icon: MinusCircleIcon, 
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-400'
    },
    { 
      value: 'medium', 
      label: t('priority.medium'), 
      icon: ExclamationCircleIcon, 
      gradient: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/20',
      textColor: 'text-yellow-400'
    },
    { 
      value: 'high', 
      label: t('priority.high'), 
      icon: ExclamationTriangleIcon, 
      gradient: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-500/20',
      textColor: 'text-red-400'
    }
  ]

  const currentPriority = priorities.find(p => p.value === priority) || priorities[1]
  const IconComponent = currentPriority.icon

  if (size === 'small' || readOnly) {
    return (
      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${currentPriority.gradient} text-white`}>
        <IconComponent className="w-3 h-3" />
        <span>{currentPriority.label}</span>
      </div>
    )
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
        className={`flex items-center space-x-4 px-8 py-5 rounded-2xl border transition-all duration-300 shadow-lg relative overflow-hidden group ${
          isOpen 
            ? 'bg-gradient-to-r from-gray-700/60 to-gray-600/60 border-cyan-400 ring-2 ring-cyan-400/30 shadow-cyan-500/20' 
            : 'bg-gradient-to-r from-gray-800/60 to-gray-700/60 border-gray-600/50 hover:border-gray-500/70 hover:shadow-xl'
        }`}
      >
        <div className={`flex items-center space-x-3 ${currentPriority.textColor} relative z-10`}>
          <div className={`p-1.5 rounded-full bg-gradient-to-r ${currentPriority.gradient} shadow-lg`}>
            <IconComponent className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">{currentPriority.label}</span>
        </div>
        <ChevronDownIcon 
          className={`w-6 h-6 text-gray-300 transition-all duration-300 relative z-10 ${
            isOpen ? 'rotate-180 text-cyan-400' : 'group-hover:text-gray-200'
          }`} 
        />
        {!isOpen && (
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-800/90 backdrop-blur-xl border border-gray-700 rounded-lg shadow-2xl z-50"
          >
            {priorities.map((p, index) => {
              const PriorityIcon = p.icon
              return (
                <motion.button
                  key={p.value}
                  onClick={() => {
                    const recentTodos = getRecentTodosByPriority(p.value)
                    if (recentTodos.length > 0) {
                      setShowSuggestions(p.value)
                      setTimeout(() => setShowSuggestions(null), 3000) // 3秒后自动隐藏
                    }
                    onPriorityChange(p.value)
                    setIsOpen(false)
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-200 ${
                    priority === p.value ? p.bgColor : 'hover:bg-white/5'
                  } ${index === 0 ? 'rounded-t-lg' : ''} ${index === priorities.length - 1 ? 'rounded-b-lg' : ''}`}
                >
                  <div className={`p-1 rounded-full bg-gradient-to-r ${p.gradient}`}>
                    <PriorityIcon className="w-3 h-3 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${
                    priority === p.value ? p.textColor : 'text-gray-300'
                  }`}>
                    {p.label}
                  </span>
                  {priority === p.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-2 h-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                    />
                  )}
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Smart Suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-xl border border-gray-600 rounded-lg shadow-2xl z-50 p-4"
          >
            <div className="text-xs text-gray-400 mb-2 font-medium">
              {t('priority.recentTodos')} ({priorities.find(p => p.value === showSuggestions)?.label}):
            </div>
            <div className="space-y-2">
              {getRecentTodosByPriority(showSuggestions).map((todo, index) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-xs text-gray-300 bg-gray-700/50 rounded px-3 py-2 truncate"
                  title={todo.text}
                >
                  • {todo.text}
                </motion.div>
              ))}
            </div>
            <button
              onClick={() => setShowSuggestions(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 text-xs"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PrioritySelector;