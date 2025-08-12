import React from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ShieldCheckIcon, 
  SparklesIcon,
  ArrowRightIcon,
  ListBulletIcon,
  BoltIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageToggle from '../components/LanguageToggle'

const LandingPage = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const features = [
    {
      icon: CheckCircleIcon,
      title: t('landing.features.easyToUse.title'),
      description: t('landing.features.easyToUse.description'),
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      icon: ClockIcon,
      title: t('landing.features.realTimeSync.title'),
      description: t('landing.features.realTimeSync.description'),
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: ShieldCheckIcon,
      title: t('landing.features.secure.title'),
      description: t('landing.features.secure.description'),
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: BoltIcon,
      title: t('landing.features.collaboration.title'),
      description: t('landing.features.collaboration.description'),
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: SparklesIcon,
      title: t('landing.features.smartReminder.title'),
      description: t('landing.features.smartReminder.description'),
      gradient: 'from-violet-500 to-purple-500'
    },
    {
      icon: DevicePhoneMobileIcon,
      title: t('landing.features.crossPlatform.title'),
      description: t('landing.features.crossPlatform.description'),
      gradient: 'from-teal-500 to-cyan-500'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -60, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.header 
          className="container mx-auto px-6 py-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                <ListBulletIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                TodoMaster
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <motion.button
                onClick={() => navigate('/auth')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200"
              >
                {t('landing.getStarted')}
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <motion.section 
          className="container mx-auto px-6 py-20 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {t('landing.title')}
              </span>
            </h2>
          </motion.div>
          
          <motion.p 
            className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            {t('landing.subtitle')}
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <motion.button
              onClick={() => navigate('/auth')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold text-lg shadow-2xl hover:shadow-cyan-500/25 transition-all duration-200 flex items-center space-x-2"
            >
              <span>{t('landing.getStarted')}</span>
              <ArrowRightIcon className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border border-gray-600 text-gray-300 rounded-xl font-semibold text-lg hover:border-gray-500 hover:text-white transition-all duration-200"
            >
              {t('landing.learnMore')}
            </motion.button>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          className="container mx-auto px-6 py-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h3 className="text-4xl font-bold text-white mb-4">
              {t('landing.whyChoose')}
            </h3>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {t('landing.whyChooseDesc')}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-4">
                    {feature.title}
                  </h4>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="container mx-auto px-6 py-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12">
            <h3 className="text-4xl font-bold text-white mb-6">
              准备好开始了吗？
            </h3>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              加入我们，体验全新的任务管理方式。注册账户，开始您的高效之旅。
            </p>
            <motion.button
              onClick={() => navigate('/auth')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold text-lg shadow-2xl hover:shadow-cyan-500/25 transition-all duration-200 inline-flex items-center space-x-2"
            >
              <span>免费注册</span>
              <ArrowRightIcon className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer 
          className="container mx-auto px-6 py-8 text-center border-t border-gray-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-500">
            &copy; 2024 TodoMaster. 专注于高效的任务管理体验。
          </p>
        </motion.footer>
      </div>
    </div>
  )
}

export default LandingPage