import React, { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { 
  PencilIcon, 
  TrashIcon, 
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import PrioritySelector from './PrioritySelector'
import { useLanguage } from '../contexts/LanguageContext'

function SortableTodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const { t } = useLanguage()

  // 同步editText与todo.text
  useEffect(() => {
    setEditText(todo.text)
  }, [todo.text])

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleEdit = useCallback(() => {
    if (editText.trim() !== '') {
      onEdit(todo.id, editText.trim())
      setIsEditing(false)
    } else {
      // 如果输入为空，恢复原文本
      setEditText(todo.text)
      setIsEditing(false)
    }
  }, [editText, onEdit, todo.id, todo.text])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleEdit()
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      setEditText(todo.text)
      setIsEditing(false)
    }
  }, [handleEdit, todo.text])

  const handleToggle = useCallback(() => {
    onToggle(todo.id)
  }, [onToggle, todo.id])

  const handleDelete = useCallback(() => {
    onDelete(todo.id)
  }, [onDelete, todo.id])

  const handleEditClick = useCallback(() => {
    setIsEditing(!isEditing)
  }, [isEditing])

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true)
  }, [])

  const priorityColors = {
    low: 'from-green-500 to-emerald-500',
    medium: 'from-yellow-500 to-orange-500', 
    high: 'from-red-500 to-pink-500'
  }

  return (
    <motion.div 
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`group relative backdrop-blur-xl bg-white/8 border border-white/15 rounded-xl sm:rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:bg-white/12 hover:border-white/25 hover:shadow-xl hover:shadow-purple-500/10 ${
        todo.completed ? 'opacity-60' : ''
      } ${isDragging ? 'shadow-2xl shadow-cyan-500/30 scale-105 rotate-2' : ''}`}
    >
      {/* Priority Indicator */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${priorityColors[todo.priority]} rounded-l-lg sm:rounded-l-xl`} />
      
      {/* Drag Handle - Invisible but functional */}
      <div 
        className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 cursor-grab active:cursor-grabbing w-4 h-4 opacity-0 touch-none"
        {...attributes} 
        {...listeners}
      />
      
      <div className="flex items-start sm:items-center flex-col sm:flex-row gap-4 sm:gap-8 ml-6 sm:ml-8">
        {/* Top Row: Checkbox, Priority, Actions */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Checkbox */}
            <motion.button
              onClick={handleToggle}
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.85 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className={`relative w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all duration-300 shadow-lg ${
                todo.completed 
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 border-transparent shadow-cyan-500/30' 
                  : 'border-gray-400 hover:border-cyan-400 hover:shadow-cyan-400/20 hover:bg-cyan-400/10'
              }`}
            >
              {todo.completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <CheckIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                </motion.div>
              )}
            </motion.button>
            
            {/* Priority Badge */}
            <div className={`px-1.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${priorityColors[todo.priority]} text-white`}>
              <span className="hidden sm:inline">{todo.priority.toUpperCase()}</span>
              <span className="sm:hidden">{todo.priority.charAt(0).toUpperCase()}</span>
            </div>
          </div>
          
          {/* Actions - Mobile */}
          {!isEditing && (
            <div className="flex items-center space-x-1 sm:hidden">
              <motion.button
                onClick={handleEditClick}
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="p-2 text-gray-400 hover:text-blue-400 transition-all duration-300 rounded-lg hover:bg-blue-400/10 hover:shadow-lg hover:shadow-blue-400/20"
                title="Edit"
              >
                <PencilIcon className="w-3 h-3" />
              </motion.button>
              <motion.button
                onClick={handleDelete}
                whileHover={{ scale: 1.2, rotate: -10 }}
                whileTap={{ scale: 0.8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="p-2 text-gray-400 hover:text-red-400 transition-all duration-300 rounded-lg hover:bg-red-400/10 hover:shadow-lg hover:shadow-red-400/20"
                title="Delete"
              >
                <TrashIcon className="w-3 h-3" />
              </motion.button>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0 w-full sm:w-auto">
          {isEditing ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={handleEdit}
                onKeyDown={handleKeyDown}
                className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400 text-sm"
                autoFocus
              />
              <div className="flex items-center space-x-2 self-end sm:self-auto">
                <motion.button
                  onClick={handleEdit}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 text-green-400 hover:text-green-300 bg-green-500/10 rounded-lg"
                >
                  <CheckIcon className="w-3 h-3" />
                </motion.button>
                <motion.button
                  onClick={() => {
                    setEditText(todo.text)
                    setIsEditing(false)
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg"
                >
                  <XMarkIcon className="w-3 h-3" />
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center justify-between w-full gap-4">
                <div 
                  className="cursor-pointer flex-1 min-w-0 py-2" 
                  onDoubleClick={handleDoubleClick}
                >
                  <p className={`font-semibold transition-all duration-200 text-lg sm:text-xl lg:text-2xl break-words leading-relaxed ${
                    todo.completed ? 'line-through text-gray-400' : 'text-white'
                  }`}>
                    {todo.text}
                  </p>
                  {todo.created_at && (
                    <p className="text-gray-500 text-xs mt-2">
                      {new Date(todo.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                
                {/* Quick Complete Button */}
                <motion.button
                  onClick={handleToggle}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-300 border ${
                    todo.completed 
                      ? 'bg-gray-600/30 border-gray-500 text-gray-400 hover:bg-gray-600/50' 
                      : 'bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30 hover:border-green-400'
                  }`}
                  title={todo.completed ? t('todo.markIncomplete') : t('todo.markComplete')}
                >
                  {todo.completed ? t('todo.markIncomplete') : t('todo.markComplete')}
                </motion.button>
              </div>
              
              {/* Actions - Desktop */}
              <div className="hidden sm:flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                <motion.button
                  onClick={handleEditClick}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.8 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="p-1.5 text-gray-400 hover:text-blue-400 transition-all duration-300 rounded-lg hover:bg-blue-400/10 hover:shadow-lg hover:shadow-blue-400/20"
                  title="Edit"
                >
                  <PencilIcon className="w-3 h-3" />
                </motion.button>
                <motion.button
                  onClick={handleDelete}
                  whileHover={{ scale: 1.2, rotate: -10 }}
                  whileTap={{ scale: 0.8 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="p-1.5 text-gray-400 hover:text-red-400 transition-all duration-300 rounded-lg hover:bg-red-400/10 hover:shadow-lg hover:shadow-red-400/20"
                  title="Delete"
                >
                  <TrashIcon className="w-3 h-3" />
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default SortableTodoItem