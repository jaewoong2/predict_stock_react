import fs from 'fs/promises';
import { siteConfig } from '../seo.config.js';

async function fetchSignalIds() {
  const res = await fetch(`${siteConfig.apiBaseUrl}/signals`);
  if (!res.ok) throw new Error('Failed to fetch signals');
  const data = await res.json();
  return Array.isArray(data) ? data : data.ids ?? [];
}

function buildSitemap(urls) {
  const items = urls
    .map(
      (u) =>
        `<url><loc>${u}</loc><lastmod>${new Date().toISOString()}</lastmod></url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`;
}

async function main() {
  const ids = await fetchSignalIds();
  const urls = [
    `${siteConfig.baseUrl}/dashboard`,
    ...ids.map((id) => `${siteConfig.baseUrl}/dashboard?signalId=${id}`),
  ];

  await fs.mkdir('public', { recursive: true });
  await fs.writeFile('public/sitemap.xml', buildSitemap(urls));

  const robots = `User-agent: *\nAllow: /\nSitemap: ${siteConfig.baseUrl}/sitemap.xml`;
  await fs.writeFile('public/robots.txt', robots);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
