'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatBubbleProps {
  message: string;
  isUser?: boolean;
  timestamp?: string;
  musicCards?: Array<{
    title: string;
    artist: string;
    cover?: string;
  }>;
}

export default function ChatBubble({
  message,
  isUser = false,
  timestamp,
  musicCards
}: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center mr-2 flex-shrink-0">
          <span className="text-white text-xs">🐱</span>
        </div>
      )}
      
      <div className={`max-w-[280px] ${isUser ? 'order-1' : 'order-2'}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white'
              : 'bg-white shadow-md border border-pink-100'
          }`}
        >
          {!isUser && (
            <div className="text-xs text-pink-400 font-semibold mb-1">DJ小助手</div>
          )}
          <p className={`text-sm ${isUser ? 'text-white' : 'text-gray-700'}`}>
            {message}
          </p>
        </div>

        {/* 音乐推荐卡片 */}
        {musicCards && musicCards.length > 0 && (
          <div className="mt-2 space-y-2">
            {musicCards.map((music, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-3 shadow-sm border border-pink-100 flex items-center gap-3 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎵</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">
                    {music.title}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {music.artist}
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center hover:bg-pink-200 transition-colors">
                  <span className="text-pink-500 text-xs">▶</span>
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {timestamp && (
          <div className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {timestamp}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center ml-2 flex-shrink-0">
          <span className="text-white text-xs">👤</span>
        </div>
      )}
    </motion.div>
  );
}

// 聊天输入框
interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-white/80 backdrop-blur-sm border-t border-pink-100">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="说点什么吧~ 💬"
        disabled={disabled}
        className="flex-1 input-cute text-sm disabled:opacity-50"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className="btn-cute text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        发送 ✨
      </button>
    </div>
  );
}
