import { useState, useEffect } from 'react'
import { arrayMove } from '@dnd-kit/sortable'

function useTodos() {
  const [todos, setTodos] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  // 从本地存储加载待办事项
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos))
      } catch (error) {
        console.error('Failed to parse todos from localStorage:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  // 保存待办事项到本地存储
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('todos', JSON.stringify(todos))
    }
  }, [todos, isLoaded])

  // 添加新的待办事项
  const addTodo = (text, priority = 'medium') => {
    if (text.trim() !== '') {
      const newTodo = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        priority: priority,
        createdAt: new Date().toLocaleString()
      }
      setTodos(prev => [...prev, newTodo])
      return true
    }
    return false
  }

  // 切换待办事项完成状态
  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  // 删除待办事项
  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  // 编辑待办事项
  const editTodo = (id, newText) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, text: newText } : todo
    ))
  }

  // 清除所有已完成的待办事项
  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed))
  }

  // 处理拖拽结束
  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setTodos(prev => {
        const oldIndex = prev.findIndex(todo => todo.id === active.id)
        const newIndex = prev.findIndex(todo => todo.id === over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  // 过滤和排序待办事项
  const getFilteredTodos = (filter, searchTerm) => {
    return todos
      .filter(todo => {
        // 状态过滤
        const statusMatch = (() => {
          if (filter === 'active') return !todo.completed
          if (filter === 'completed') return todo.completed
          return true
        })()
        
        // 搜索过滤
        const searchMatch = searchTerm === '' || 
          todo.text.toLowerCase().includes(searchTerm.toLowerCase())
        
        return statusMatch && searchMatch
      })
      .sort((a, b) => {
        // 按优先级排序：高 > 中 > 低
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        if (a.completed !== b.completed) {
          return a.completed - b.completed // 未完成的在前
        }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })
  }

  // 统计信息
  const getStats = () => {
    const completedCount = todos.filter(todo => todo.completed).length
    const activeCount = todos.length - completedCount
    return {
      total: todos.length,
      completed: completedCount,
      active: activeCount
    }
  }

  return {
    todos,
    isLoaded,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    handleDragEnd,
    getFilteredTodos,
    getStats
  }
}

export default useTodos