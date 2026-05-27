'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  cover?: string;
}

interface MiniPlayerProps {
  currentTrack?: Track;
  isPlaying?: boolean;
  progress?: number;
  onPlayPause?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function MiniPlayer({
  currentTrack,
  isPlaying = false,
  progress = 0,
  onPlayPause,
  onNext,
  onPrev
}: MiniPlayerProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return (
      <div className="glass rounded-2xl p-4 text-center">
        <div className="text-3xl mb-2">🎵</div>
        <p className="text-sm text-gray-500">还没有播放歌曲哦~</p>
        <p className="text-xs text-gray-400 mt-1">和我聊聊，我给你推荐！</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-4"
    >
      <div className="flex items-center gap-3">
        {/* 封面 */}
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center flex-shrink-0 shadow-lg"
        >
          {currentTrack.cover ? (
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-2xl">🎵</span>
          )}
        </motion.div>

        {/* 歌曲信息 */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-800 truncate">
            {currentTrack.title}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {currentTrack.artist}
          </div>

          {/* 进度条 */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-pink-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-xs text-gray-400">
              {formatTime(currentTrack.duration * progress / 100)}
            </span>
          </div>
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <button
          onClick={onPrev}
          className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center hover:bg-pink-200 transition-colors"
        >
          <span className="text-pink-500">⏮</span>
        </button>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onPlayPause}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        >
          <span className="text-white text-lg">
            {isPlaying ? '⏸' : '▶'}
          </span>
        </motion.button>
        
        <button
          onClick={onNext}
          className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center hover:bg-pink-200 transition-colors"
        >
          <span className="text-pink-500">⏭</span>
        </button>
      </div>
    </motion.div>
  );
}
