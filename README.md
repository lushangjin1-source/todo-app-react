# Todo App - 现代化待办事项应用

一个功能完整的现代化待办事项应用，支持用户认证、实时数据同步、拖拽排序等功能。

## ✨ 功能特性

- 🔐 **用户认证系统** - 基于 Supabase 的注册/登录功能
- 📝 **待办事项管理** - 添加、编辑、删除、完成状态切换
- 🎯 **优先级分类** - 高、中、低三个优先级别
- 🔄 **拖拽排序** - 支持拖拽重新排列待办事项
- 🌍 **国际化支持** - 中文/英文语言切换
- 🌙 **主题切换** - 深色/浅色模式
- 📱 **响应式设计** - 完美适配各种设备
- ⚡ **实时同步** - 数据实时保存到云端

## 🛠️ 技术栈

- **前端框架**: React 19.1.0
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **图标**: Heroicons
- **后端服务**: Supabase
- **拖拽功能**: @dnd-kit
- **路由**: React Router DOM
- **语言**: TypeScript

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm 或 yarn

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/your-username/todo-app.git
   cd todo-app
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **环境配置**
   
   创建 `.env` 文件并配置 Supabase：
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   
   打开浏览器访问 `http://localhost:5173`

### 构建生产版本

```bash
npm run build
```

## 📁 项目结构