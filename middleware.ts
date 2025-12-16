import { next } from '@vercel/edge';

export const config = {
  // Only run middleware on these paths
  matcher: '/:path*',
};

export default function middleware(request: Request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  
  // Define bot user agents
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
    'discordbot', 
    'pinterest',
    'tumblr',
    'vkshare',
    'skypeuripreview',
    'line-poker',
    'tiantianspider',
    'bitlybot',
    'aolbuild', 
    'yahoo',
    'msnbot',
    'gigabot'
  ];

  const isBot = BOT_USER_AGENTS.some(bot => userAgent.toLowerCase().includes(bot));
  
  // Skip if it's an API request or static asset
  if (
    url.pathname.startsWith('/api') || 
    url.pathname.startsWith('/assets') ||
    url.pathname.includes('.')
  ) {
    return next();
  }

  if (isBot) {
    // Rewrite to the prerender Function
    // We pass the full path as a query parameter
    url.pathname = '/api/prerender';
    url.searchParams.set('path', request.url);
    return fetch(url);
  }

  return next();
}
