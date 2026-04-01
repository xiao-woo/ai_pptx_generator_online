# AI PPT Generator - 最小MVP版本

## 🚀 项目简介

这是一个最小MVP版本，用于验证GitHub Pages部署流程。

**特点：**
- ✅ 纯静态页面
- ✅ 无需后端API
- ✅ 响应式设计
- ✅ 现代化UI

## 📦 技术栈

- **前端**: React 18 + TypeScript + Vite
- **样式**: Tailwind CSS
- **部署**: GitHub Pages
- **CI/CD**: GitHub Actions

## 🌐 访问地址

**GitHub Pages**: https://xiao-woo.github.io/ai_pptx_generator_online/

## 📋 项目结构

```
ai-ppt-generator/
├── frontend/                 # 前端代码
│   ├── src/
│   │   ├── App.tsx         # 主组件
│   │   ├── main.tsx        # 入口文件
│   │   ├── index.css       # 样式文件
│   │   └── vite-env.d.ts   # Vite环境变量类型声明
│   ├── package.json
│   └── vite.config.ts
├── .github/                  # GitHub Actions
│   └── workflows/
│       └── deploy.yml      # 部署配置
└── README.md
```

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
cd frontend
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 部署到GitHub Pages

1. 代码推送到main分支后，GitHub Actions会自动触发部署
2. 访问GitHub Actions查看部署状态
3. 等待部署完成后，访问GitHub Pages地址

## ⚙️ GitHub Actions配置

**触发条件**: push到main分支

**部署目标**: GitHub Pages

**GitHub Secrets**:
- `GH_PAT_TOKEN`: GitHub Personal Access Token（需要repo权限）

## 📝 注意事项

- 当前版本为最小MVP，仅包含静态页面
- 无需后端API，完全静态
- 部署完成后会获得公网访问地址
- GitHub Pages可能需要几分钟才能更新

## 🎯 下一步计划

- [ ] 添加AI对话功能
- [ ] 集成PPT生成
- [ ] 完善用户界面
- [ ] 添加后端API

## 📄 许可证

MIT License

---

**版本**: v1.0 - 最小MVP
**状态**: 🟢 已部署到GitHub Pages
