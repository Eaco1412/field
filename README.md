# 情绪星野

> 一款轻量的 AI 情绪陪伴 App，用温暖的方式记录心事，获得理解与行动的力量。

<video src="demoVideo.mp4" controls autoplay loop muted width="100%" style="border-radius: 8px; max-width: 600px;"></video>

---

## ✨ 产品简介

情绪星野是一款面向年轻人的 AI 情绪陪伴与行动引导应用。用户可以记录每日心事，获得 AI 的理解与陪伴，并收到个性化的行动推荐。通过拼图成就系统，让每一个小行动都有迹可循。

### 核心功能

- **心情日志** — 支持完整模式（AI 分析 + 推荐卡片）和安静模式（仅记录）
- **AI 情绪陪伴** — 调用 DeepSeek 大模型，生成理解卡、行动卡、求助卡
- **拼图成就系统** — 彩色已拼 + 黑白灰未拼，完成行动解锁碎片
- **发现页** — 12 个分类的行动推荐，点击进入详情页
- **回访机制** — 多轮对话式回访，记录行动体验

---

## 🚀 快速开始

### 环境要求

- Node.js >= 20.x
- npm 或 pnpm
- 手机安装 [Expo Go](https://expo.dev/client)（推荐）或 Android/iOS 模拟器

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npx expo start
```

启动后会显示二维码：

- **手机体验（推荐）**：用手机相机扫描二维码，自动跳转到 Expo Go
- **Web 体验**：在终端按 `w` 键，自动打开浏览器
- **Android 模拟器**：在终端按 `a` 键
- **iOS 模拟器**：在终端按 `i` 键（仅 macOS）

### 清除数据

进入「我的」→「设置」→「清除所有数据」即可重置 Demo 数据。

---

## 🧩 项目结构

```
├── app/                    # Expo Router 页面路由
│   ├── (tabs)/            # 底部 Tab 页（首页/发现/我的）
│   └── sub/               # 二级页面
├── src/
│   ├── components/        # UI 组件
│   ├── config/            # 配置（AI 模型等）
│   ├── constants/         # 全局文案
│   ├── context/           # 全局状态（AppContext）
│   ├── hooks/             # 自定义 Hooks
│   ├── services/          # 业务逻辑层
│   │   ├── api/           # 真实 API 实现
│   │   └── mock/          # Mock 数据实现
│   ├── theme/             # 主题样式
│   └── utils/             # 工具函数
├── api/                   # Vercel Serverless Function（AI 代理）
├── worker/                # Cloudflare Worker 版本（已弃用）
├── app.json               # Expo 配置
└── package.json
```

---

## 🤖 AI 功能配置

### 使用内置 Mock 数据（默认）

默认使用 Mock 数据，无需配置任何 API Key 即可体验完整功能。

### 接入真实 DeepSeek API

项目使用 **Vercel Serverless Function** 作为代理，避免在前端暴露 API Key。

#### 方式一：部署到 Vercel

1. 推送代码到 GitHub/GitLab
2. 在 Vercel Dashboard 导入项目，自动部署
3. 配置环境变量：
   - `DEEPSEEK_API_KEY`：你的 DeepSeek API Key
4. 部署完成后获得 URL（格式：`https://你的项目名.vercel.app/api/ai-proxy`）
5. 修改 [src/config/ai.ts](src/config/ai.ts) 中的 `proxyUrl` 为你的 Vercel 地址

#### 方式二：本地开发代理

1. 在项目根目录创建 `.env.local` 文件：
   ```
   DEEPSEEK_API_KEY=你的APIKey
   ```
2. 启动 Vercel 本地开发：
   ```bash
   npx vercel dev
   ```
3. 修改 `proxyUrl` 为 `http://localhost:3000/api/ai-proxy`

### 切换 AI 模型

进入「我的」→「设置」→「AI 模型」，点击切换：

- `deepseek-chat` — DeepSeek 对话模型（默认，速度快、价格低）
- `deepseek-reasoner` — DeepSeek 推理模型（推理更深，适合复杂情绪）

---

## 🎨 设计规范

- **主色调**：`#7BAE7F`（绿色）
- **背景色**：`#FAF8F5`（暖米色）
- **设计风格**：玻璃质感（Glassmorphism）+ 柔和阴影
- **字体**：系统默认字体
- **Tab 结构**：首页 / 发现 / 我的

---

## 🛠 技术栈

| 分类 | 技术 |
|-----|------|
| 框架 | React Native 0.86 + Expo 57 |
| 路由 | Expo Router（文件路由） |
| 状态管理 | React Context + useReducer |
| 本地存储 | AsyncStorage |
| 语言 | TypeScript（严格模式） |
| 图表 | react-native-chart-kit |
| 图标 | @expo/vector-icons (Ionicons) |
| AI 代理 | Vercel Serverless Function |

---

## 📝 开发说明

### 数据存储

所有数据均存储在本地 AsyncStorage 中，**无后端依赖**。Demo 阶段使用 Mock 数据填充。

### 业务分层

- **UI 层**：`app/` + `src/components/` — 只负责渲染和交互
- **Hook 层**：`src/hooks/` — 组合业务逻辑和状态
- **Service 层**：`src/services/` — 纯业务逻辑，可切换 mock/api 实现

### 安全机制

- 高危关键词检测（自伤/自杀）触发危机干预卡片
- 提供 24 小时心理援助热线（12320-5）
- 内置求助话术模板

---

## 🙏 致谢

本项目的开发过程中，**Trae IDE** 发挥了至关重要的作用。从项目架构设计、代码编写、AI 功能集成到 Vercel 部署，绝大部分工作都是在 Trae 的辅助下完成的。Trae 的智能代码补全、架构分析和问题排查能力极大地提高了开发效率，让整个项目能够快速落地。

感谢 Trae 提供如此强大的 AI 开发工具！

---

## �️ 投票支持

如果这个项目对你有帮助，欢迎为我投票支持！👉 [https://forum.trae.cn/t/topic/168038](https://forum.trae.cn/t/topic/168038)

---

## �📄 License

MIT
