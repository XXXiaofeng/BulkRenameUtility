#!/usr/bin/env node

/**
 * Generate sitemap.xml for bulk-rename-utility.com
 * This script creates a sitemap with all pages and their metadata
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE_URL = 'https://bulk-rename-utility.com'

const pages = [
    {
        path: '/',
        priority: '1.0',
        changefreq: 'weekly',
        lastmod: new Date().toISOString().split('T')[0]
    },
    {
        path: '/photo-renamer',
        priority: '0.8',
        changefreq: 'monthly',
        lastmod: new Date().toISOString().split('T')[0]
    },
    {
        path: '/file-organizer',
        priority: '0.9',
        changefreq: 'weekly',
        lastmod: new Date().toISOString().split('T')[0]
    },
    {
        path: '/duplicate-finder',
        priority: '0.7',
        changefreq: 'monthly',
        lastmod: new Date().toISOString().split('T')[0]
    },
    {
        path: '/file-cleaner',
        priority: '0.7',
        changefreq: 'monthly',
        lastmod: new Date().toISOString().split('T')[0]
    },
    {
        path: '/about',
        priority: '0.6',
        changefreq: 'monthly',
        lastmod: new Date().toISOString().split('T')[0]
    },
    {
        path: '/privacy',
        priority: '0.5',
        changefreq: 'monthly',
        lastmod: new Date().toISOString().split('T')[0]
    },
    {
        path: '/contact',
        priority: '0.6',
        changefreq: 'monthly',
        lastmod: new Date().toISOString().split('T')[0]
    }
]

function generateSitemap() {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    pages.forEach(page => {
        xml += '  <url>\n'
        xml += `    <loc>${BASE_URL}${page.path}</loc>\n`
        xml += `    <lastmod>${page.lastmod}</lastmod>\n`
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`
        xml += `    <priority>${page.priority}</priority>\n`
        xml += '  </url>\n'
    })

    xml += '</urlset>'

    return xml
}

function main() {
    const sitemapContent = generateSitemap()
    const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml')

    fs.writeFileSync(outputPath, sitemapContent, 'utf8')
    console.log('✅ Sitemap generated successfully!')
    console.log(`📁 Location: ${outputPath}`)
    console.log(`📊 Total URLs: ${pages.length}`)

    pages.forEach(page => {
        console.log(`   - ${BASE_URL}${page.path} (priority: ${page.priority})`)
    })
}

main()
