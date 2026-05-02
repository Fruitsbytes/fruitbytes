#!/usr/bin/env node

/**
 * Sitemap Generator for FruitsBytes
 * Automatically generates sitemap.xml with all routes and blog posts
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://fruitsbytes.com';
const OUTPUT_PATH = path.join(__dirname, '../www/sitemap.xml');

// Static routes with their priorities and change frequencies
const STATIC_ROUTES = [
  { url: '/', priority: 1.0, changefreq: 'weekly' },
  { url: '/welcome', priority: 0.9, changefreq: 'weekly' },
  { url: '/about-me', priority: 0.8, changefreq: 'monthly' },
  { url: '/my-blog', priority: 0.8, changefreq: 'weekly' },
  { url: '/my-projects', priority: 0.8, changefreq: 'monthly' },
  { url: '/contact-me', priority: 0.7, changefreq: 'monthly' },
  { url: '/console-log', priority: 0.5, changefreq: 'weekly' },
];

// Read blog posts from blogService.ts
function getBlogPosts() {
  const blogServicePath = path.join(__dirname, '../src/services/blogService.ts');
  const content = fs.readFileSync(blogServicePath, 'utf-8');

  // Extract blog post IDs and dates using regex
  const posts = [];
  const postMatches = content.matchAll(/id:\s*'([^']+)',[\s\S]*?date:\s*'([^']+)'/g);

  for (const match of postMatches) {
    const [, id, date] = match;
    posts.push({
      url: `/my-blog#${id}`,
      lastmod: date,
      priority: 0.7,
      changefreq: 'monthly'
    });
  }

  return posts;
}

// Generate sitemap XML
function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
  const blogPosts = getBlogPosts();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n';
  xml += '        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n';

  // Add static routes
  STATIC_ROUTES.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}${route.url}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  // Add blog posts
  blogPosts.forEach(post => {
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}${post.url}</loc>\n`;
    xml += `    <lastmod>${post.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${post.changefreq}</changefreq>\n`;
    xml += `    <priority>${post.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>\n';

  return xml;
}

// Write sitemap to file
function writeSitemap() {
  try {
    const sitemap = generateSitemap();

    // Ensure www directory exists
    const wwwDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(wwwDir)) {
      fs.mkdirSync(wwwDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_PATH, sitemap, 'utf-8');
    console.log('✅ Sitemap generated successfully:', OUTPUT_PATH);
    console.log(`   Total URLs: ${STATIC_ROUTES.length + getBlogPosts().length}`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run
writeSitemap();
