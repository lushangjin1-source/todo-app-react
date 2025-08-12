import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { db } from '../lib/supabase'
import ThemeToggle from '../components/ThemeToggle'
import useTheme from '../hooks/useTheme'
import PrioritySelector from '../components/PrioritySelector'
import SortableTodoItem from '../components/SortableTodoItem'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers'

const TodoApp = () => {
  const { user, signOut } = useAuth()
  const { t } = useLanguage()
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('medium')
  const [searchTerm, setSearchTerm] = useState('')
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { theme, setTheme } = useTheme()

  // 拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // 加载用户的待办事项
  const loadTodos = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const { data, error } = await db.getTodos(user.id)
      if (error) throw error
      setTodos(data || [])
    } catch (error) {
      console.error('Error loading todos:', error)
      setError('Failed to load todos')
    } finally {
      setLoading(false)
    }
  }

  // 初始加载
  useEffect(() => {
    loadTodos()
  }, [user])

  // 添加新的待办事项
  const addTodo = useCallback(async () => {
    if (!inputValue.trim() || !user) return
    
    try {
      const newTodo = {
        text: inputValue.trim(),
        completed: false,
        priority: selectedPriority,
        order_index: todos.length
      }
      
      const { data, error } = await db.createTodo(newTodo, user.id)
      if (error) throw error
      
      if (data && data[0]) {
        setTodos(prev => [data[0], ...prev])
        setInputValue('')
        setSelectedPriority('medium')
      }
    } catch (error) {
      console.error('Error adding todo:', error)
      setError('Failed to add todo')
    }
  }, [inputValue, user, selectedPriority, todos.length])

  // 切换待办事项完成状态
  const toggleTodo = useCallback(async (id) => {
    if (!user) return
    
    try {
      const todo = todos.find(t => t.id === id)
      if (!todo) return
      
      const { data, error } = await db.updateTodo(id, { completed: !todo.completed }, user.id)
      if (error) throw error
      
      setTodos(prev => prev.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ))
    } catch (error) {
      console.error('Error toggling todo:', error)
      setError('Failed to update todo')
    }
  }, [user, todos])

  // 删除待办事项
  const deleteTodo = useCallback(async (id) => {
    if (!user) return
    
    try {
      const { error } = await db.deleteTodo(id, user.id)
      if (error) throw error
      
      setTodos(prev => prev.filter(t => t.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
      setError('Failed to delete todo')
    }
  }, [user])

  // 编辑待办事项
  const editTodo = useCallback(async (id, newText) => {
    if (!user || !newText.trim()) return
    
    try {
      const { data, error } = await db.updateTodo(id, { text: newText.trim() }, user.id)
      if (error) throw error
      
      setTodos(prev => prev.map(t => 
        t.id === id ? { ...t, text: newText.trim() } : t
      ))
    } catch (error) {
      console.error('Error editing todo:', error)
      setError('Failed to edit todo')
    }
  }, [user])

  // 清除已完成的待办事项
  const clearCompleted = useCallback(async () => {
    if (!user) return
    
    try {
      const completedTodos = todos.filter(t => t.completed)
      const deletePromises = completedTodos.map(t => db.deleteTodo(t.id, user.id))
      await Promise.all(deletePromises)
      
      setTodos(prev => prev.filter(t => !t.completed))
    } catch (error) {
      console.error('Error clearing completed todos:', error)
      setError('Failed to clear completed todos')
    }
  }, [user, todos])

  // 处理拖拽结束
  const handleDragEnd = async (event) => {
    const { active, over } = event
    
    if (!over || active.id === over.id || !user) return
    
    const oldIndex = todos.findIndex(t => t.id === active.id)
    const newIndex = todos.findIndex(t => t.id === over.id)
    
    if (oldIndex === -1 || newIndex === -1) return
    
    const newTodos = arrayMove(todos, oldIndex, newIndex)
    setTodos(newTodos)
    
    // 更新服务器端的顺序
    try {
      const updates = newTodos.map((todo, index) => ({
        id: todo.id,
        order_index: index
      }))
      
      await db.batchUpdateTodos(updates, user.id)
    } catch (error) {
      console.error('Error updating todo order:', error)
      // 如果更新失败，恢复原来的顺序
      loadTodos()
    }
  }

  // 处理回车键添加待办事项
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTodo()
    }
  }, [addTodo])

  // 获取过滤后的待办事项
  const getFilteredTodos = useMemo(() => {
    let filtered = todos
    
    // 按状态过滤
    if (filter === 'active') {
      filtered = filtered.filter(todo => !todo.completed)
    } else if (filter === 'completed') {
      filtered = filtered.filter(todo => todo.completed)
    }
    
    // 按搜索词过滤
    if (searchTerm) {
      filtered = filtered.filter(todo => 
        todo.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    return filtered.sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
  }, [todos, filter, searchTerm])

  // 获取统计信息
  const getStats = useMemo(() => {
    const total = todos.length
    const completed = todos.filter(t => t.completed).length
    const active = total - completed
    return { total, completed, active }
  }, [todos])

  const filteredTodos = getFilteredTodos
  const { total, completed: completedCount, active: activeCount } = getStats

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-10 left-10 sm:top-20 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 rounded-full blur-3xl"
          animate={{
            x: [0, 60, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 sm:bottom-20 sm:right-20 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-2xl"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center max-w-7xl mx-auto gap-3 sm:gap-4 lg:gap-6">
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-1">
            <motion.div
              className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-base sm:text-lg lg:text-xl">📝</span>
            </motion.div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {t('todo.title')}
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm lg:text-base">
                <span className="truncate block max-w-[150px] sm:max-w-[200px] lg:max-w-none">{user?.email}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 w-full lg:w-auto justify-end flex-wrap sm:flex-nowrap gap-y-2">
            {/* Priority Selector - Optimized for responsive layout */}
            <div className="order-first lg:order-none flex-shrink-0">
              <PrioritySelector 
                priority={selectedPriority} 
                onPriorityChange={setSelectedPriority}
                todos={todos}
              />
            </div>
            <div className="flex-shrink-0">
              <ThemeToggle theme={theme} onThemeChange={setTheme} />
            </div>
            <motion.button
              onClick={signOut}
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.94 }}
              className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 text-red-400 hover:text-red-300 rounded-lg sm:rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-400/50 font-semibold shadow-lg hover:shadow-xl hover:shadow-red-500/20 relative overflow-hidden group flex-shrink-0"
              title={t('auth.logout')}
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
              <span className="text-sm sm:text-base relative z-10 hidden sm:inline">{t('auth.logout')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
        <motion.div
          className="backdrop-blur-2xl bg-white/8 border border-white/20 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 shadow-2xl shadow-purple-500/10 ring-1 ring-white/10"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-center"
            >
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="text-lg font-semibold text-red-300 mb-2">Oops! Something went wrong</h3>
              <p className="text-red-400 mb-4">{error}</p>
              <div className="flex justify-center gap-3">
                <button 
                  onClick={() => setError(null)}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                >
                  Dismiss
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>🔄</span>
                  Try Again
                </button>
              </div>
            </motion.div>
          )}

          {/* Add Todo Input */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-10">
            <div className="flex-1 relative group">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('todo.placeholder')}
                  className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 xl:py-6 bg-gradient-to-r from-gray-800/60 to-gray-700/60 border border-gray-600/50 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 text-base sm:text-lg lg:text-xl shadow-inner group-hover:border-gray-500/50 focus:shadow-lg focus:shadow-cyan-500/20"
                  disabled={loading}
                />
                {loading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400">
                    ⏳
                  </div>
                )}
              </div>
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
            <motion.button
              onClick={addTodo}
              disabled={loading || !inputValue.trim()}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-5 xl:py-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-bold rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-base sm:text-lg lg:text-xl whitespace-nowrap min-w-[120px] sm:min-w-[140px] lg:min-w-[160px] relative overflow-hidden group flex-shrink-0"
            >
              {loading ? (
                <div className="relative z-10 flex items-center justify-center">
                  ⏳
                </div>
              ) : (
                <span className="relative z-10">{t('todo.addNew')}</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </motion.button>
          </div>

          {/* Search */}
          <div className="mb-4 sm:mb-6 lg:mb-8 relative group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('todo.searchPlaceholder')}
              className="w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-4 lg:py-5 bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/40 rounded-lg sm:rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 text-sm sm:text-base lg:text-lg shadow-inner group-hover:border-gray-500/40 focus:shadow-lg focus:shadow-purple-500/20"
            />
            <div className="absolute inset-0 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8 lg:mb-10">
            {[
              { key: 'all', label: `${t('todo.all')} (${total})`, shortLabel: t('todo.all') },
              { key: 'active', label: `${t('todo.pending')} (${activeCount})`, shortLabel: t('todo.pending') },
              { key: 'completed', label: `${t('todo.completed')} (${completedCount})`, shortLabel: t('todo.completed') }
            ].map(({ key, label, shortLabel }) => (
              <motion.button
                key={key}
                onClick={() => setFilter(key)}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-xs sm:text-sm lg:text-base flex-1 sm:flex-none min-w-0 relative overflow-hidden group ${
                  filter === key
                    ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400/20'
                    : 'bg-gray-800/60 text-gray-300 hover:text-white hover:bg-gray-700/60 border border-gray-600/30 hover:border-gray-500/50'
                }`}
              >
                <span className="relative z-10 truncate">
                  <span className="sm:hidden">{shortLabel}</span>
                  <span className="hidden sm:inline">{label}</span>
                </span>
                {filter !== key && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </motion.button>
            ))}
          </div>

          {/* Todo List */}
          <div className="space-y-2">
            {filteredTodos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-gray-400"
              >
                {searchTerm ? (
                    `${t('todo.noResults')} "${searchTerm}"`
                  ) : (
                  <>
                    {filter === 'all' && t('todo.addFirst')}
                    {filter === 'active' && t('todo.noActive')}
                    {filter === 'completed' && t('todo.noCompleted')}
                  </>
                )}
              </motion.div>
            ) : (
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext 
                  items={filteredTodos.map(todo => todo.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {filteredTodos.map(todo => (
                    <SortableTodoItem 
                      key={todo.id} 
                      todo={todo} 
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                      onEdit={editTodo}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>

          {/* Footer */}
          {total > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 pt-6 border-t border-gray-700/50 gap-3 sm:gap-0"
            >
              <div className="text-gray-400 text-xs sm:text-sm">
                <span className="hidden sm:inline">{t('todo.stats.total')}: {total} | {t('todo.stats.completed')}: {completedCount} | {t('todo.stats.active')}: {activeCount}</span>
                <span className="sm:hidden">{total} {t('todo.stats.total').toLowerCase()} • {completedCount} {t('todo.stats.completed').toLowerCase()} • {activeCount} {t('todo.stats.left')}</span>
              </div>
              {completedCount > 0 && (
                <motion.button
                  onClick={clearCompleted}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-3 sm:px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm self-end sm:self-auto"
                >
                  {t('delete')} {t('todo.completed')}
                </motion.button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default TodoApp