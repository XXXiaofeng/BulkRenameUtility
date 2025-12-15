import { NextRequest, NextResponse } from 'next/server';

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

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const url = request.nextUrl.clone();

  // 如果是爬虫，重定向到预渲染API
  if (isBot(userAgent)) {
    console.log(`[Middleware] Bot detected: ${userAgent}`);

    // 构建预渲染API的URL
    url.pathname = '/api/prerender';
    url.searchParams.set('path', request.nextUrl.pathname);

    return NextResponse.rewrite(url);
  }

  // 普通用户直接访问
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了:
     * - api (API 路由)
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico (favicon)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}