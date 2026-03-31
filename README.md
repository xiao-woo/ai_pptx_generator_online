<<<<<<< HEAD
# AI PPT 生成器

基于人工智能的智能 PPT 生成器，支持自动生成大纲、对话调整、多模板选择和一键导出。

## 功能特性

### 前端功能
- 🎨 **智能大纲生成**：输入主题，AI 自动生成结构化大纲
- 💬 **对话式调整**：通过对话实时调整大纲内容
- 🎯 **多模板选择**：提供多种专业模板（现代蓝色、优雅紫色、专业灰色等）
- 👁️ **实时预览**：所见即所得的 PPT 预览
- 📥 **一键导出**：支持导出为 PPTX 格式
- 🐛 **问题反馈**：集成 GitHub Issues，方便用户反馈问题

### 后端功能
- 🤖 **多模型支持**：支持 OpenAI、Anthropic、Azure OpenAI、DeepSeek 等多个大模型
- 🔄 **自动故障转移**：模型故障时自动切换到备用模型
- 🖼️ **智能图片生成**：支持网络图片和 SVG 矢量图
- 📊 **PPT 导出**：使用 python-pptx 生成高质量 PPT
- 🗄️ **数据持久化**：使用 SQLite 存储大纲、PPT 等数据

## 技术栈

### 前端
- React 18 + TypeScript
- Vite
- React Router
- Zustand (状态管理)
- Tailwind CSS
- pptxgenjs (PPT 渲染)
- Axios

### 后端
- Python 3.11
- FastAPI
- SQLAlchemy (异步 ORM)
- python-pptx (PPT 生成)
- OpenAI SDK
- Anthropic SDK
- httpx (异步 HTTP 客户端)

### DevOps
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Nginx (反向代理)

## 项目结构

```
ai-ppt-generator/
├── frontend/                 # 前端代码
│   ├── src/
│   │   ├── api/             # API 调用
│   │   ├── components/      # 组件
│   │   ├── pages/           # 页面
│   │   ├── store/           # 状态管理
│   │   ├── types/           # 类型定义
│   │   └── utils/           # 工具函数
│   ├── package.json
│   └── Dockerfile
├── backend/                  # 后端代码
│   ├── app/
│   │   ├── api/             # API 路由
│   │   ├── models/          # 数据模型
│   │   ├── schemas/         # 数据模式
│   │   ├── services/        # 业务逻辑
│   │   ├── config.py        # 配置
│   │   └── database.py      # 数据库
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker/                   # Docker 配置
│   └── nginx.conf
├── .github/                  # GitHub Actions
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── docker-compose.yml
└── README.md
```

## 快速开始

### 环境要求
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose (可选)

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/yourusername/ai-ppt-generator.git
cd ai-ppt-generator
```

2. **配置环境变量**
```bash
cp .env.example .env
```

编辑 `.env` 文件，填写必要的配置：
```env
# AI Models
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# GitHub Issues (可选)
GITHUB_TOKEN=your_github_token
GITHUB_REPO=your_username/ai-ppt-generator

# Image Generation (可选)
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

3. **使用 Docker 启动（推荐）**
```bash
docker-compose up -d
```

访问 http://localhost:5173

4. **手动启动**

启动后端：
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

启动前端：
```bash
cd frontend
npm install
npm run dev
```

## 使用指南

### 1. 生成大纲
1. 在首页输入主题
2. 点击"生成大纲"
3. 等待 AI 生成结构化大纲

### 2. 编辑大纲
1. 在大纲编辑页面查看生成的章节
2. 通过对话框输入调整建议
3. AI 会根据您的建议更新大纲
4. 也可以手动编辑章节标题和内容

### 3. 选择模板
1. 在模板选择页面浏览可用模板
2. 点击选择喜欢的模板
3. 点击"生成 PPT"

### 4. 预览和导出
1. 在预览页面查看生成的幻灯片
2. 可以翻页查看所有幻灯片
3. 点击"导出 PPT"下载 PPTX 文件

### 5. 问题反馈
1. 在问题反馈页面选择反馈类型
2. 填写标题和详细描述
3. 提交后会自动创建 GitHub Issue

## API 文档

启动后端服务后，访问 http://localhost:8000/docs 查看 Swagger API 文档。

### 主要 API 端点

- `POST /api/outline/generate` - 生成大纲
- `GET /api/outline/{id}` - 获取大纲
- `POST /api/outline/update` - 更新大纲
- `POST /api/ppt/generate` - 生成 PPT
- `GET /api/ppt/{id}` - 获取 PPT
- `GET /api/ppt/{id}/export` - 导出 PPT
- `GET /api/templates` - 获取模板列表
- `POST /api/feedback` - 提交反馈

## 开发指南

### 前端开发
```bash
cd frontend
npm install
npm run dev      # 开发模式
npm run build    # 生产构建
npm run lint     # 代码检查
```

### 后端开发
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload  # 开发模式
uvicorn main:app --host 0.0.0.0 --port 8000  # 生产模式
```

### 添加新的模板
编辑 `backend/app/services/ppt_service.py`，在 `self.templates` 字典中添加新的模板配置。

### 添加新的 AI 模型
1. 在 `backend/app/services/llm_service.py` 中添加新的客户端方法
2. 在 `self.models` 字典中注册新模型
3. 在 `.env` 中添加相应的 API Key 配置

## 部署

### Docker 部署
```bash
docker-compose up -d
```

### GitHub Actions 自动部署
1. 配置 GitHub Secrets：
   - `DOCKER_USERNAME` - Docker Hub 用户名
   - `DOCKER_PASSWORD` - Docker Hub 密码
   - `SERVER_HOST` - 服务器地址
   - `SERVER_USER` - 服务器用户名
   - `SERVER_SSH_KEY` - SSH 私钥

2. 推送到 main 分支，自动触发部署

## 常见问题

### Q: 大纲生成失败？
A: 请检查 `.env` 文件中的 API Key 是否正确配置，并确保网络连接正常。

### Q: 图片无法加载？
A: 如果没有配置 Unsplash API Key，系统会使用占位图。建议配置 Unsplash Access Key 以获取高质量图片。

### Q: 导出的 PPT 样式不正确？
A: 确保使用的是支持的浏览器（Chrome、Firefox、Edge），并清除浏览器缓存后重试。

## 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 联系方式

- 项目主页：https://github.com/yourusername/ai-ppt-generator
- 问题反馈：https://github.com/yourusername/ai-ppt-generator/issues
- 邮箱：your.email@example.com

## 致谢

- [OpenAI](https://openai.com/) - GPT 模型支持
- [Anthropic](https://www.anthropic.com/) - Claude 模型支持
- [FastAPI](https://fastapi.tiangolo.com/) - 现代化的 Python Web 框架
- [React](https://react.dev/) - 前端框架
- [pptxgenjs](https://gitbrent.github.io/PptxGenJS/) - JavaScript PPT 生成库
- [python-pptx](https://python-pptx.readthedocs.io/) - Python PPT 生成库# Test deployment
=======
# ai_pptx_generator_online
We can use the AI model ability, to create PPT online.
>>>>>>> 2d9ba9c79f5acdfca009468f7ba1ee24a639f1d6
