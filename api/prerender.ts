// Vercel Edge Function for prerendering
import chromium from '@sparticuz/chromium';

// 搜索引擎爬虫 User-Agent 列表
const BOT_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'slackbot',
  'telegrambot',
  'discordbot'
];

// 检查是否为爬虫
function isBot(userAgent: string): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
}

export default async function handler(request: Request): Promise<Response> {
  try {
    const userAgent = request.headers.get('user-agent') || '';
    const url = new URL(request.url);
    const path = url.searchParams.get('path') || '/';

    // 如果不是爬虫，返回错误
    if (!isBot(userAgent)) {
      return new Response('Not Found', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }

    // 构建完整的 URL
    const protocol = url.protocol;
    const host = url.host;
    const fullUrl = `${protocol}//${host}${path}`;

    console.log(`[Prerender] Bot detected: ${userAgent}`);
    console.log(`[Prerender] Rendering: ${fullUrl}`);

    // 由于 Edge Functions 的限制，我们返回一个简化的 HTML
    // 在实际部署中，你可以使用外部预渲染服务
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>批量重命名工具 - Bulk Rename Utility</title>
    <meta name="description" content="免费的批量文件重命名工具，支持多种重命名规则">
    <meta name="keywords" content="批量重命名, 文件重命名, rename, bulk rename">
</head>
<body>
    <h1>批量重命名工具</h1>
    <p>这是一个专业的批量文件重命名工具，支持：</p>
    <ul>
        <li>批量重命名文件</li>
        <li>照片重命名</li>
        <li>重复文件查找</li>
        <li>文件整理</li>
    </ul>
    <p>访问我们的网站体验完整功能。</p>
    <script>
        // 如果是真实用户，重定向到主应用
        if (!navigator.userAgent.toLowerCase().includes('bot')) {
            window.location.href = '${path}';
        }
    </script>
</body>
</html>`;

    // 返回预渲染的 HTML
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'X-Prerendered': 'true'
      }
    });

  } catch (error) {
    console.error('[Prerender] Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Prerender failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

// 导出配置
export const config = {
  runtime: 'edge',
  regions: ['all'] // 部署到所有边缘节点
};