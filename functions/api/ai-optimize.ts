// functions/api/ai-optimize.ts
// AI优化功能 - 使用豆包API (Seedream 图生图)

interface RequestBody {
  image: string;
  prompt?: string;
}

const DOUBAO_API_KEY = process.env.DOUBAO_API_KEY || '';
const DOUBAO_MODEL_ID = process.env.DOUBAO_MODEL_ID || '';

export async function onRequest(context: any) {
  const { request } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!DOUBAO_API_KEY || !DOUBAO_MODEL_ID) {
    return new Response(JSON.stringify({ error: 'Doubao API credentials not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body: RequestBody = await request.json();
    const { image, prompt } = body;

    if (!image) {
      return new Response(JSON.stringify({ error: 'Image is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 调用豆包 Seedream 图生图 API[reference:15]
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DOUBAO_API_KEY}`,
      },
      body: JSON.stringify({
        model: DOUBAO_MODEL_ID,
        prompt: prompt || '将图片转换为可爱的Q版卡通风格，大头小身体，圆润脸型，大眼睛，清晰的线条，轮廓黑色明显，颜色干净明亮，色块尽量少，纯白背景，适合制作拼豆图纸',  // ← 这就是生成Q版卡通的关键提示词[reference:16]
        image: image,
        response_format: 'b64_json',  // 返回 base64 格式[reference:17]
        size: '1024x1024',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('豆包API调用失败:', errorText);
      return new Response(JSON.stringify({ error: `Doubao API error: ${response.status}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const generatedImage = data.data?.[0]?.b64_json;

    if (!generatedImage) {
      return new Response(JSON.stringify({ error: 'No image generated' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 返回与原来格式一致的图片数据，前端无需修改
    return new Response(JSON.stringify({ image: `data:image/png;base64,${generatedImage}` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('处理请求出错:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
