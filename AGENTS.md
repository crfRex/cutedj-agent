# CuteDJ - 智能音乐DJ Agent

## 项目概述
一个可爱的桌面虚拟DJ助手，具有以下功能：
- 桌面虚拟角色（Live2D）
- 智能对话推荐音乐
- 多平台音乐支持（Spotify/网易云/QQ音乐）
- 根据心情推荐歌曲

## 技术栈
- **前端**: Next.js 15 + TypeScript + Tailwind CSS
- **桌面**: Tauri (Rust) - 轻量级跨平台桌面框架
- **AI**: Claude API (Anthropic)
- **动画**: Framer Motion + pixi-live2d-display
- **状态管理**: Zustand

## 开发指南

### 启动开发服务器
```bash
cd frontend
npm run dev
```

### 构建生产版本
```bash
npm run build
npm run start
```

### 项目结构
```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API 路由
│   │   │   └── chat/         # Claude 对话 API
│   │   ├── globals.css       # 全局样式
│   │   ├── layout.tsx        # 布局组件
│   │   └── page.tsx          # 主页面
│   ├── components/
│   │   ├── character/        # Live2D 角色组件
│   │   ├── chat/             # 聊天组件
│   │   └── player/           # 播放器组件
│   └── lib/                  # 工具库
├── public/
│   └── models/               # Live2D 模型文件
└── package.json
```

## 环境变量
复制 `.env.local.example` 为 `.env.local`，填入：
- `ANTHROPIC_API_KEY`: Claude API 密钥
- `SPOTIFY_CLIENT_ID`: Spotify API (可选)
- `SPOTIFY_CLIENT_SECRET`: Spotify API (可选)

## Live2D 模型
当前使用占位模型，需要替换为真正的 Live2D 模型：
1. 从 Booth.pm 或 GitHub 下载免费模型
2. 放入 `public/models/` 目录
3. 更新 `CharacterViewer.tsx` 中的 `modelPath`

## 待完成功能
- [ ] Tauri 桌面集成
- [ ] 系统托盘和全局热键
- [ ] Spotify API 集成
- [ ] 网易云音乐 API 集成
- [ ] 语音合成功能
- [ ] 角色表情同步
- [ ] 设置页面
