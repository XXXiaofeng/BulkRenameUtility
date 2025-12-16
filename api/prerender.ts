import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Set aggressive CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Handle OPTIONS request
  if (request.method === 'OPTIONS') {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.setHeader(key, value);
    });
    return response.status(200).end();
  }

  try {
    const { path } = request.query;

    if (!path || typeof path !== 'string') {
      return response.status(400).send('Missing path parameter');
    }

    // Configure chromium
    // We need to point to a valid chromium executable. 
    // @sparticuz/chromium provides the path to the binary.

    // NOTE: In Vercel Serverless Functions (Node.js), we need to handle the executable path carefully.
    // Local development vs Production
    const executablePath = await chromium.executablePath() || '/usr/bin/google-chrome-stable';

    const browser = await puppeteer.launch({
      args: (chromium as any).args,
      defaultViewport: (chromium as any).defaultViewport,
      executablePath,
      headless: (chromium as any).headless,
      ignoreHTTPSErrors: true,
    } as any);

    const page = await browser.newPage();

    // Set a meaningful User-Agent so we don't look like a generic bot, 
    // or keep default to look like Chrome
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36');

    // Interpret the path. If it's a full URL, use it. If it's a relative path, construct the URL.
    // The middleware passes the full request.url in 'path'.
    let targetUrl = path;
    if (!targetUrl.startsWith('http')) {
      // Fallback if something weird was passed. 
      // We assume the host processing this request is the target host if not specified
      const host = request.headers.host;
      const protocol = request.headers['x-forwarded-proto'] || 'https';
      targetUrl = `${protocol}://${host}${path}`;
    }

    console.log(`[Prerender] Visiting: ${targetUrl}`);

    await page.goto(targetUrl, {
      waitUntil: 'networkidle0', // Wait until network is idle
      timeout: 30000 // 30s timeout
    });

    // Extract the HTML
    const html = await page.content();

    await browser.close();

    // Cache the result
    response.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.setHeader(key, value);
    });

    return response.status(200).send(html);

  } catch (error) {
    console.error('[Prerender] Error:', error);
    return response.status(500).json({
      error: 'Prerender failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}