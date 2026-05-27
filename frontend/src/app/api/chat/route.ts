import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `你是一个可爱的DJ音乐助手，名叫"CuteDJ小助手"。
你的性格温柔、活泼、善解人意，喜欢用可爱的表情符号。

你的主要功能：
1. 和用户进行日常对话，了解他们的心情
2. 根据用户的心情和喜好推荐音乐
3. 分析用户的音乐口味，给出个性化推荐

回复规则：
- 保持回复简洁可爱
- 适当使用表情符号（但不要过多）
- 推荐音乐时，给出3首左右的歌曲
- 回复格式：先表达理解/共情，然后推荐歌曲

示例回复格式：
"听起来你今天心情不错呢~ 🎵 给你推荐几首欢快的歌曲吧！"

推荐歌曲格式（JSON）：
{
  "message": "你的回复文字",
  "recommendations": [
    { "title": "歌曲名", "artist": "歌手" }
  ]
}`;

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    // 检查 API Key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // 返回模拟响应（开发模式）
      const mockResponse = getMockResponse(message);
      return NextResponse.json(mockResponse);
    }

    // 调用 Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [
          ...(history || []),
          { role: 'user', content: message }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content[0].text;

    // 尝试解析 JSON 响应
    try {
      const parsed = JSON.parse(content);
      return NextResponse.json(parsed);
    } catch {
      // 如果不是 JSON，返回纯文本
      return NextResponse.json({
        message: content,
        recommendations: [],
      });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: '抱歉，我暂时无法回复，请稍后再试~ 😿' },
      { status: 500 }
    );
  }
}

// 模拟响应（开发模式使用）
function getMockResponse(message: string) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('心情不好') || lowerMessage.includes('难过')) {
    return {
      message: '抱抱你~ 给你推荐几首治愈系的歌曲，希望能让心情好起来 💕',
      recommendations: [
        { title: '小幸运', artist: '田馥甄' },
        { title: '稻香', artist: '周杰伦' },
        { title: '你笑起来真好看', artist: '李昕融' },
      ],
    };
  }

  if (lowerMessage.includes('推荐') || lowerMessage.includes('听什么')) {
    return {
      message: '根据你的口味，我猜你会喜欢这些~ 🎶',
      recommendations: [
        { title: '起风了', artist: '买辣椒也用券' },
        { title: '光年之外', artist: '邓紫棋' },
        { title: '告白气球', artist: '周杰伦' },
      ],
    };
  }

  if (lowerMessage.includes('嗨') || lowerMessage.includes('开心')) {
    return {
      message: '哇~ 看来你心情不错呢！来点欢快的歌曲吧 🎉',
      recommendations: [
        { title: '热爱105°C的你', artist: '阿肆' },
        { title: '学猫叫', artist: '小潘潘' },
      ],
    };
  }

  return {
    message: `收到！你说的是"${message}"对吧？让我想想有什么好听的歌推荐给你~ 🤔`,
    recommendations: [],
  };
}
