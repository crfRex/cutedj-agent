'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CharacterViewer from '@/components/character/CharacterViewer';
import ChatBubble, { ChatInput } from '@/components/chat/ChatBubble';
import MiniPlayer from '@/components/player/MiniPlayer';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  musicCards?: Array<{
    title: string;
    artist: string;
    cover?: string;
  }>;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  cover?: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '你好呀！我是你的DJ小助手 🎵 今天想听什么类型的音乐呢？或者和我聊聊你的心情吧~',
      isUser: false,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | undefined>({
    id: '1',
    title: '晴天',
    artist: '周杰伦',
    duration: 269,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 模拟进度条
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 0.5;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSend = async (text: string) => {
    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // 模拟AI回复（后续接入Claude API）
    setTimeout(() => {
      let responseText = '';
      let musicCards: Message['musicCards'] = undefined;

      if (text.includes('心情不好') || text.includes('难过') || text.includes('伤心')) {
        responseText = '抱抱你~ 给你推荐几首治愈系的歌曲，希望能让心情好起来 💕';
        musicCards = [
          { title: '小幸运', artist: '田馥甄' },
          { title: '稻香', artist: '周杰伦' },
          { title: '你笑起来真好看', artist: '李昕融' },
        ];
      } else if (text.includes('推荐') || text.includes('听什么')) {
        responseText = '根据你的口味，我猜你会喜欢这些~ 🎶';
        musicCards = [
          { title: '起风了', artist: '买辣椒也用券' },
          { title: '光年之外', artist: '邓紫棋' },
          { title: '告白气球', artist: '周杰伦' },
        ];
      } else if (text.includes('嗨') || text.includes('开心') || text.includes('快乐')) {
        responseText = '哇~ 看来你心情不错呢！来点欢快的歌曲吧 🎉';
        musicCards = [
          { title: '热爱105°C的你', artist: '阿肆' },
          { title: '学猫叫', artist: '小潘潘' },
        ];
      } else {
        responseText = `收到！你说的是"${text}"对吧？让我想想有什么好听的歌推荐给你~ 🤔`;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        musicCards,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      {/* 头部 */}
      <header className="glass border-b border-pink-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl"
          >
            🎵
          </motion.div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            CuteDJ
          </h1>
          <span className="text-xs text-gray-400">你的智能音乐助手</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center hover:bg-pink-200 transition-colors">
            <span className="text-sm">⚙️</span>
          </button>
          <button className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center hover:bg-pink-200 transition-colors">
            <span className="text-sm">👤</span>
          </button>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：角色区域 */}
        <div className="w-[320px] flex flex-col items-center justify-center p-4 border-r border-pink-100/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CharacterViewer
              width={280}
              height={380}
              onModelLoad={() => console.log('Model loaded!')}
            />
          </motion.div>
          
          {/* 状态标签 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 flex gap-2"
          >
            <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-xs">
              🎧 听歌中
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-xs">
              😊 心情好
            </span>
          </motion.div>
        </div>

        {/* 右侧：聊天和播放器 */}
        <div className="flex-1 flex flex-col">
          {/* 聊天区域 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  message={msg.text}
                  isUser={msg.isUser}
                  timestamp={msg.timestamp}
                  musicCards={msg.musicCards}
                />
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-gray-400"
              >
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                  <span className="text-xs">🐱</span>
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 rounded-full bg-pink-300"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 rounded-full bg-pink-400"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 rounded-full bg-pink-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 迷你播放器 */}
          <div className="px-4 pb-2">
            <MiniPlayer
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              progress={progress}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onNext={() => console.log('Next track')}
              onPrev={() => console.log('Previous track')}
            />
          </div>

          {/* 输入框 */}
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
