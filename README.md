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

### 方式一：手机体验（推荐）

**前提条件：**
- 手机安装 [Expo Go](https://expo.dev/client)（iOS App Store / Android Google Play）
- 电脑和手机连接同一个 WiFi

**步骤：**

1. **下载代码**
   ```bash
   git clone https://github.com/你的用户名/你的仓库名.git
   cd 你的仓库名
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npx expo start
   ```

4. **扫码体验**
   - 终端会显示二维码
   - 用手机相机扫描二维码 → 自动跳转到 Expo Go
   - 等待几秒钟加载完成，即可开始使用

> ✨ **开箱即用**：项目已经配置好 AI 代理，默认使用真实 DeepSeek API 进行情绪分析。

### 方式二：Web 浏览器体验

1. 启动开发服务器后，在终端按 `w` 键
2. 自动打开浏览器，访问 `http://localhost:8081`
3. 在浏览器中直接使用 App

> ⚠️ 注意：Web 版体验不如手机端，部分原生功能可能受限。

### 方式三：Android/iOS 模拟器

**Android 模拟器：**
1. 安装 [Android Studio](https://developer.android.com/studio)
2. 创建虚拟设备（推荐 Pixel 7，API 33+）
3. 在终端按 `a` 键，自动安装到模拟器

**iOS 模拟器（仅 macOS）：**
1. 安装 Xcode
2. 在终端按 `i` 键，自动启动 iOS 模拟器

---

## 📦 AI 功能配置

### 默认配置：开箱即用

项目已经配置好 AI 代理（部署在 Vercel），默认使用真实 DeepSeek API 进行情绪分析。下载代码后无需任何配置，直接运行即可体验完整 AI 功能。

### 使用自己的 DeepSeek API Key

如果你想使用自己的 API Key（避免消耗我的额度），可以按以下步骤部署自己的代理：

#### 步骤一：部署到 Vercel

点击下方按钮，一键部署 AI 代理服务：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/你的用户名/你的仓库名&env=DEEPSEEK_API_KEY&project-name=emotion-starfield-proxy&repo-name=emotion-starfield-proxy)

1. 点击上面的按钮，跳转到 Vercel
2. 登录/注册 Vercel 账号（推荐用 GitHub 账号）
3. 填写 `DEEPSEEK_API_KEY`（你的 DeepSeek API Key，可在 [DeepSeek Console](https://platform.deepseek.com/) 获取）
4. 点击「Deploy」开始部署（约 1-2 分钟）
5. 部署完成后，复制你的代理 URL（格式：`https://你的项目名.vercel.app`）

#### 步骤二：更新代理配置

修改 `src/config/ai.ts` 文件中的 `proxyUrl`：

```typescript
// src/config/ai.ts
export const AI_CONFIG = {
  proxyUrl: 'https://你的项目名.vercel.app/api/ai-proxy', // 修改为你的 Vercel 地址
  // ...
};
```

### 切换 AI 模型

进入「我的」→「设置」→「AI 模型」：

- **deepseek-chat** — 对话模型（默认，速度快、价格低）
- **deepseek-reasoner** — 推理模型（推理更深，适合复杂情绪分析）

---

## 🐛 常见问题排查

### Q1: Expo Go 扫码后无法连接

**解决方案：**
- 确保电脑和手机在同一个 WiFi 网络
- 检查防火墙是否阻止了端口 8081 和 19000-19006
- 尝试重启开发服务器：`npx expo start --clear`

### Q2: AI 代理部署后返回 400 错误

**检查项：**
- 是否已在 Vercel 配置 `DEEPSEEK_API_KEY`
- API Key 是否正确（无空格、无换行）
- 是否重新部署了项目（环境变量需要重新部署才生效）

**测试方法：**
```bash
curl -X POST https://你的项目名.vercel.app/api/ai-proxy \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"你好"}]}'
```

### Q3: AI 请求超时

**可能原因：**
- Vercel 免费版函数执行时间限制为 10 秒
- DeepSeek API 响应较慢

**解决方案：**
- 升级 Vercel Pro（无执行时间限制）
- 或使用 Cloudflare Worker 部署代理（无时间限制）

### Q4: 依赖安装失败

**解决方案：**
```bash
npm install --legacy-peer-deps
# 或
pnpm install
```

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

本项目的开发过程中，**Trae IDE** 发挥了至关重要的作用。从项目架构设计、代码编写、AI 功能集成到 Vercel 部署，绝大部分工作都是在 Trae 的辅助下完成的。

---

## 📄 License

MIT
