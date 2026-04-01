# AI PPT Generator - 最小MVP版本

## 🚀 快速开始

这是一个最小MVP版本，用于验证GitHub Pages部署流程。

### ✅ 已完成

- ✅ 简单的静态页面
- ✅ 响应式设计
- ✅ 现代化UI
- ✅ GitHub Actions CI/CD配置

### 📋 部署步骤

#### 1. 配置GitHub Secrets

在GitHub仓库中配置以下Secrets：

**GitHub Pages部署：**
- `GH_PAT_TOKEN`: GitHub Personal Access Token（需要repo权限）

**Railway部署（可选）：**
- `RAILWAY_TOKEN`: Railway API Token
- `RAILWAY_SERVICE_ID`: Railway Service ID

#### 2. 获取GitHub Personal Access Token

1. 访问 https://github.com/settings/tokens
2. 点击"Generate new token (classic)"
3. 选择权限：repo（所有repo权限）
4. 生成token并复制
5. 在GitHub仓库的Settings > Secrets and variables > Actions中添加

#### 3. 触发部署

代码推送到main分支后，GitHub Actions会自动触发部署。

查看部署状态：
- 访问 https://github.com/xiao-woo/ai_pptx_generator_online/actions
- 等待workflow完成
- 访问GitHub Pages查看结果

### 🎯 下一步计划

- [ ] 添加AI对话功能
- [ ] 集成PPT生成
- [ ] 完善用户界面
- [ ] 添加后端API

### 📦 技术栈

- **前端**: React 18 + TypeScript + Vite
- **样式**: Tailwind CSS
- **部署**: GitHub Pages
- **CI/CD**: GitHub Actions

### 📝 注意事项

- 当前版本为最小MVP，仅包含静态页面
- 需要配置GitHub Secrets才能部署
- 部署完成后会获得公网访问地址

---

**部署状态**: 🟢 代码已推送，等待GitHub Actions部署
