import { Page } from 'puppeteer-core';
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

// 获取页面内容
async function getPageContent(url: string): Promise<string> {
  let browser;

  try {
    // 在 Vercel 环境中使用 chrome-aws-lambda
    if (process.env.VERCEL) {
      const puppeteer = await import('puppeteer-core');
      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      // 本地开发环境
      const puppeteer = await import('puppeteer');
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }

    const page = await browser.newPage();

    // 设置视口
    await page.setViewport({ width: 1280, height: 720 });

    // 导航到页面
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // 等待 Vue 应用挂载完成
    await page.waitForTimeout(2000);

    // 获取渲染后的 HTML
    const html = await page.content();

    await browser.close();

    return html;
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    throw error;
  }
}

export default async function handler(req: any, res: any) {
  try {
    // 获取请求头
    const userAgent = req.headers['user-agent'] || '';
    const path = req.query.path || '/';

    // 如果不是爬虫，返回原始页面
    if (!isBot(userAgent)) {
      return res.status(404).send('Not Found');
    }

    // 构建完整的 URL
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['host'];
    const url = `${protocol}://${host}${path}`;

    console.log(`[Prerender] Bot detected: ${userAgent}`);
    console.log(`[Prerender] Rendering: ${url}`);

    // 获取预渲染的 HTML
    const html = await getPageContent(url);

    // 设置缓存头
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.setHeader('X-Prerendered', 'true');

    // 返回预渲染的 HTML
    res.status(200).send(html);

  } catch (error) {
    console.error('[Prerender] Error:', error);
    res.status(500).json({
      error: 'Prerender failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}