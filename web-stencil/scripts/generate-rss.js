#!/usr/bin/env node

/**
 * RSS Feed Generator for FruitsBytes Blog
 * Generates RSS 2.0 feed for all blog posts
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://fruitsbytes.com';
const OUTPUT_PATH = path.join(__dirname, '../www/rss.xml');

// Read blog posts from blogService.ts
function getBlogPosts() {
  const blogServicePath = path.join(__dirname, '../src/services/blogService.ts');
  const content = fs.readFileSync(blogServicePath, 'utf-8');

  const posts = [];

  // Extract blog post data using regex
  const postRegex = /{[\s\S]*?id:\s*'([^']+)'[\s\S]*?title:\s*'([^']+)'[\s\S]*?description:\s*'([^']+)'[\s\S]*?author:\s*'([^']+)'[\s\S]*?date:\s*'([^']+)'[\s\S]*?category:\s*'([^']+)'/g;

  let match;
  while ((match = postRegex.exec(content)) !== null) {
    const [, id, title, description, author, date, category] = match;
    posts.push({
      id,
      title,
      description,
      author,
      date,
      category,
      url: `${SITE_URL}/my-blog#${id}`
    });
  }

  // Sort by date (newest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return posts;
}

// Escape XML special characters
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Convert date to RFC 822 format
function toRFC822(dateString) {
  const date = new Date(dateString);
  return date.toUTCString();
}

// Generate RSS feed
function generateRSS() {
  const blogPosts = getBlogPosts();
  const buildDate = new Date().toUTCString();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n';
  xml += '  <channel>\n';
  xml += `    <title>FruitsBytes Blog</title>\n`;
  xml += `    <description>Insights on web development, AI, and modern software engineering by Jeffrey Nicholson Carré</description>\n`;
  xml += `    <link>${SITE_URL}/my-blog</link>\n`;
  xml += `    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />\n`;
  xml += `    <language>en-us</language>\n`;
  xml += `    <lastBuildDate>${buildDate}</lastBuildDate>\n`;
  xml += `    <generator>FruitsBytes Custom RSS Generator</generator>\n`;
  xml += `    <webMaster>jeffrey.carre@anbapyezanman.com (Jeffrey Nicholson Carré)</webMaster>\n`;
  xml += `    <image>\n`;
  xml += `      <url>${SITE_URL}/assets/icon/icon-512x512.png</url>\n`;
  xml += `      <title>FruitsBytes</title>\n`;
  xml += `      <link>${SITE_URL}</link>\n`;
  xml += `    </image>\n\n`;

  // Add blog post items
  blogPosts.forEach(post => {
    xml += '    <item>\n';
    xml += `      <title>${escapeXml(post.title)}</title>\n`;
    xml += `      <description>${escapeXml(post.description)}</description>\n`;
    xml += `      <link>${post.url}</link>\n`;
    xml += `      <guid isPermaLink="true">${post.url}</guid>\n`;
    xml += `      <pubDate>${toRFC822(post.date)}</pubDate>\n`;
    xml += `      <author>jeffrey.carre@anbapyezanman.com (${escapeXml(post.author)})</author>\n`;
    xml += `      <category>${escapeXml(post.category)}</category>\n`;
    xml += '    </item>\n\n';
  });

  xml += '  </channel>\n';
  xml += '</rss>\n';

  return xml;
}

// Write RSS to file
function writeRSS() {
  try {
    const rss = generateRSS();

    // Ensure www directory exists
    const wwwDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(wwwDir)) {
      fs.mkdirSync(wwwDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_PATH, rss, 'utf-8');
    console.log('✅ RSS feed generated successfully:', OUTPUT_PATH);
    console.log(`   Total posts: ${getBlogPosts().length}`);
  } catch (error) {
    console.error('❌ Error generating RSS feed:', error);
    process.exit(1);
  }
}

// Run
writeRSS();
