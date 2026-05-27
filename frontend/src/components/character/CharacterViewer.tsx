'use client';

import { useEffect, useRef, useState } from 'react';

interface CharacterViewerProps {
  modelPath?: string;
  width?: number;
  height?: number;
  onModelLoad?: () => void;
}

export default function CharacterViewer({
  modelPath = '/models/shizuku/shizuku.model.json',
  width = 300,
  height = 400,
  onModelLoad
}: CharacterViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let app: any = null;
    let model: any = null;

    const initLive2D = async () => {
      try {
        const PIXI = await import('pixi.js');
        const { Live2DModel } = await import('pixi-live2d-display');

        // 暴露 PIXI 到 window
        (window as any).PIXI = PIXI;

        if (!canvasRef.current) return;

        // 创建 PIXI 应用
        app = new PIXI.Application({
          view: canvasRef.current,
          width,
          height,
          backgroundAlpha: 0,
          antialias: true,
        });

        // 加载模型
        model = await Live2DModel.from(modelPath, {
          autoInteract: true,
          autoUpdate: true,
        });

        // 设置模型位置和大小
        model.scale.set(0.3);
        model.anchor.set(0.5, 0.5);
        model.x = width / 2;
        model.y = height / 2;

        // 添加到舞台
        app.stage.addChild(model);

        // 交互事件
        model.on('hit', (hitAreas: string[]) => {
          console.log('Hit areas:', hitAreas);
          if (hitAreas.includes('Head')) {
            model.motion('TapHead');
          } else if (hitAreas.includes('Body')) {
            model.motion('TapBody');
          }
        });

        setIsLoading(false);
        onModelLoad?.();
      } catch (err) {
        console.error('Failed to load Live2D model:', err);
        setError('模型加载失败，请检查模型文件是否存在');
        setIsLoading(false);
      }
    };

    initLive2D();

    return () => {
      if (app) {
        app.destroy(true);
      }
    };
  }, [modelPath, width, height, onModelLoad]);

  return (
    <div className="relative" style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-bounce text-4xl">🎀</div>
          <span className="ml-2 text-pink-500">加载中...</span>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <div className="text-4xl mb-2">😿</div>
          <p className="text-sm text-gray-500">{error}</p>
          <p className="text-xs text-gray-400 mt-1">将显示默认占位图</p>
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{ width, height }}
        className={`${isLoading || error ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
      />
    </div>
  );
}
