// functions/api/ai-optimize.ts
// AI优化功能 - 使用豆包图生图 API

interface RequestBody {
  image: string;      // Base64 或 URL
  prompt?: string;    // 可选提示词
}

const DOUBAO_API_KEY = process.env.DOUBAO_API_KEY || '';
const DOUBAO_MODEL_ID = process.env.DOUBAO_MODEL_ID || '';

export async function onRequest(context: any) {
  const { request } = context;

  // 1. 只接受 POST 请求
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 2. 检查环境变量是否配置
  if (!DOUBAO_API_KEY || !DOUBAO_MODEL_ID) {
    return new Response(JSON.stringify({ 
      error: 'Doubao API credentials not configured. Please set DOUBAO_API_KEY and DOUBAO_MODEL_ID in environment variables.' 
    }), {
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

    // 3. 构建请求体（完全参考官方 curl 示例）
    const requestBody = {
      model: DOUBAO_MODEL_ID,
      prompt: prompt || '将图片转换为可爱的Q版卡通风格，大头小身体，圆润脸型，大眼睛，清晰的线条，轮廓描边清晰，颜色干净明亮，色块尽量少且去掉杂色，纯白背景，适合制作拼豆图纸',
      image: image,        // 直接传图片，不包装成数组
      sequential_image_generation: "disabled",
      response_format: "b64_json",   // 返回 base64 格式
      size: "1024x1024",
      stream: false,
      watermark: false,    // 建议关闭水印
    };

    console.log('调用豆包 API，模型:', DOUBAO_MODEL_ID);

    // 4. 调用豆包 API
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DOUBAO_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    // 5. 如果 API 返回错误，输出详细日志
    if (!response.ok) {
      const errorText = await response.text();
      console.error('豆包 API 调用失败，状态码:', response.status, '错误详情:', errorText);
      return new Response(JSON.stringify({ 
        error: `Doubao API error: ${response.status}`,
        detail: errorText 
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 6. 解析响应
    const data = await response.json();
    console.log('豆包 API 响应成功，数据长度:', JSON.stringify(data).length);

    // 根据 response_format: "b64_json" 获取图片数据
    const generatedImage = data.data?.[0]?.b64_json;

    if (!generatedImage) {
      return new Response(JSON.stringify({ 
        error: 'No image generated from Doubao API',
        response: data 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 7. 返回与原来格式一致的图片数据
    return new Response(JSON.stringify({ 
      image: `data:image/png;base64,${generatedImage}` 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('处理请求出错:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      message: error?.message || 'Unknown error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
