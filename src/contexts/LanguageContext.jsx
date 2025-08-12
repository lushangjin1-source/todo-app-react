import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext({})

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// 翻译文本
const translations = {
  zh: {
    // 通用
    loading: '加载中...',
    error: '错误',
    success: '成功',
    cancel: '取消',
    confirm: '确认',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    
    // 着陆页
    landing: {
      title: '高效管理您的每一个任务',
      subtitle: 'TodoMaster 是一款现代化的任务管理应用，帮助您高效地组织、跟踪和完成日常任务。通过直观的界面设计和强大的功能，让您的工作和生活更加井然有序。',
      getStarted: '立即开始',
      learnMore: '了解更多',
      whyChoose: '为什么选择 TodoMaster？',
      whyChooseDesc: '我们专注于提供最佳的任务管理体验，让您专注于真正重要的事情',
      features: {
        easyToUse: {
          title: '简单易用',
          description: '直观的用户界面，让您快速上手，专注于任务本身而非学习如何使用工具。'
        },
        realTimeSync: {
          title: '实时同步',
          description: '云端同步技术确保您的任务在所有设备上保持最新状态，随时随地访问。'
        },
        secure: {
          title: '安全可靠',
          description: '企业级安全保护，您的数据安全是我们的首要任务，支持多重身份验证。'
        },
        smartReminder: {
          title: '智能提醒',
          description: '智能算法分析您的工作习惯，在最合适的时间提醒您完成重要任务。'
        },
        collaboration: {
          title: '高效协作',
          description: '团队协作功能让您与同事无缝配合，共同完成项目目标。'
        },
        crossPlatform: {
          title: '跨平台支持',
          description: '支持所有主流平台和设备，确保您在任何地方都能高效工作。'
        }
      }
    },
    
    // 认证相关
    auth: {
      login: '登录',
      register: '注册',
      logout: '退出登录',
      email: '邮箱',
      password: '密码',
      confirmPassword: '确认密码',
      forgotPassword: '忘记密码？',
      noAccount: '还没有账户？',
      hasAccount: '已有账户？',
      signUp: '注册账户',
      signIn: '立即登录',
      emailVerification: '请检查您的邮箱并点击验证链接完成注册',
      loginError: '登录失败，请检查您的邮箱和密码',
      registerError: '注册失败，请重试',
      passwordMismatch: '密码不匹配'
    },
    
    // 待办事项相关
    todo: {
        title: '我的待办事项',
        addNew: '添加新任务',
        placeholder: '输入新任务...',
        searchPlaceholder: '搜索任务...',
        completed: '已完成',
        pending: '待完成',
        all: '全部',
        noTodos: '暂无待办事项',
        noResults: '未找到匹配的待办事项',
        noActive: '太棒了！没有待完成的任务',
        noCompleted: '还没有已完成的任务',
        addFirst: '添加您的第一个任务吧！',
        markComplete: '标记完成',
        markIncomplete: '标记未完成',
        stats: {
          total: '总计',
          completed: '已完成',
          active: '待完成',
          left: '剩余'
        }
      },
      priority: {
        low: '低',
        medium: '中',
        high: '高',
        label: '优先级',
        recentTodos: '最近的待办事项'
      },
      theme: {
        switchTo: '切换到',
        dark: '深色',
        light: '浅色',
        mode: '模式'
      }
  },
  en: {
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    
    // Landing page
    landing: {
      title: 'Efficiently Manage Every Task',
      subtitle: 'TodoMaster is a modern task management application that helps you efficiently organize, track, and complete daily tasks. With intuitive interface design and powerful features, make your work and life more organized.',
      getStarted: 'Get Started',
      learnMore: 'Learn More',
      whyChoose: 'Why Choose TodoMaster?',
      whyChooseDesc: 'We focus on providing the best task management experience, letting you focus on what truly matters',
      features: {
        easyToUse: {
          title: 'Easy to Use',
          description: 'Intuitive user interface that lets you get started quickly, focusing on tasks rather than learning how to use the tool.'
        },
        realTimeSync: {
          title: 'Real-time Sync',
          description: 'Cloud synchronization technology ensures your tasks stay up-to-date across all devices, accessible anytime, anywhere.'
        },
        secure: {
          title: 'Secure & Reliable',
          description: 'Enterprise-grade security protection. Your data security is our top priority, with multi-factor authentication support.'
        },
        smartReminder: {
          title: 'Smart Reminders',
          description: 'Intelligent algorithms analyze your work habits and remind you to complete important tasks at the most appropriate times.'
        },
        collaboration: {
          title: 'Efficient Collaboration',
          description: 'Team collaboration features let you work seamlessly with colleagues to achieve project goals together.'
        },
        crossPlatform: {
          title: 'Cross-platform Support',
          description: 'Support for all major platforms and devices, ensuring you can work efficiently anywhere.'
        }
      }
    },
    
    // Auth related
    auth: {
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot Password?',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      signUp: 'Sign Up',
      signIn: 'Sign In',
      emailVerification: 'Please check your email and click the verification link to complete registration',
      loginError: 'Login failed, please check your email and password',
      registerError: 'Registration failed, please try again',
      passwordMismatch: 'Passwords do not match'
    },
    
    // Todo related
    todo: {
      title: 'My Todos',
      addNew: 'Add New Task',
      placeholder: 'Enter new task...',
      searchPlaceholder: 'Search tasks...',
      completed: 'Completed',
      pending: 'Pending',
      all: 'All',
      noTodos: 'No todos yet',
      noResults: 'No todos found matching',
      noActive: 'Great! No active tasks',
      noCompleted: 'No completed tasks yet',
      addFirst: 'Add your first task!',
      markComplete: 'Mark Complete',
      markIncomplete: 'Mark Incomplete',
      stats: {
        total: 'Total',
        completed: 'Completed',
        active: 'Active',
        left: 'left'
      }
    },
    priority: {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      label: 'Priority',
      recentTodos: 'Recent Todos'
    },
    theme: {
      switchTo: 'Switch to ',
      dark: 'dark',
      light: 'light',
      mode: ' mode'
    }
  }
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('zh') // 默认中文

  // 从localStorage加载语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
      setLanguage(savedLanguage)
    }
  }, [])

  // 保存语言设置到localStorage
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  // 翻译函数
  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key // 如果找不到翻译，返回原键
      }
    }
    
    return value || key
  }

  const value = {
    language,
    changeLanguage,
    t,
    isZh: language === 'zh',
    isEn: language === 'en'
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}