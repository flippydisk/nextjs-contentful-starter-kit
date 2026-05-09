import dayjs from 'dayjs';
import { fetchData } from '~/contentful/contentfulAPIUtils';
import { NEXT_PUBLIC_SITE_URL } from '~/state/env';
import hasContent from '~/utils/hasContent';

export const dynamic = 'force-static';

const siteUrl = NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
const staticFallbackEntries = [
    {
        priority: '0.5',
        slug: 'privacy'
    }
];

const escapeXml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('\'', '&apos;');

const formatDate = dateString => dayjs(dateString).format('YYYY-MM-DD');

const getPageUrl = (slug = '') => {
    const path = !slug || slug === 'home' ? '/' : `/${slug}`;

    return new URL(path, siteUrl).toString();
};

const getSitemapEntries = async () => {
    const pages = await fetchData();
    const home = [{
        lastModified: formatDate(new Date()),
        priority: '1.0',
        url: getPageUrl('home')
    }];

    if (!hasContent(pages)) {
        return home.concat(staticFallbackEntries.map(({
            priority,
            slug
        }) => ({
            lastModified: formatDate(new Date()),
            priority,
            url: getPageUrl(slug)
        })));
    }

    const contentfulEntries = pages
        .filter(({
            fields: {
                seo: {
                    fields: {
                        sitemapPriority
                    } = {}
                } = {}
            } = {}
        } = {}) => sitemapPriority !== -1)
        .map(({
            fields: {
                seo: {
                    fields: {
                        sitemapPriority = '0.5'
                    } = {}
                } = {},
                slug = ''
            } = {},
            sys: {
                updatedAt
            } = {}
        } = {}) => ({
            lastModified: formatDate(updatedAt || new Date()),
            priority: sitemapPriority,
            url: getPageUrl(slug)
        }));

    const dedupedEntries = new Map();

    home.concat(contentfulEntries).forEach((entry = {}) => {
        if (!entry?.url || dedupedEntries.has(entry.url)) return;
        dedupedEntries.set(entry.url, entry);
    });

    return Array.from(dedupedEntries.values());
};

const buildSitemapXml = (entries = []) => {
    const urls = entries.map(({
        lastModified = '',
        priority = '',
        url = ''
    } = {}) => `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${escapeXml(lastModified)}</lastmod>
    <priority>${escapeXml(priority)}</priority>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
};

export const GET = async () => {
    const entries = await getSitemapEntries();
    const xml = buildSitemapXml(entries);

    return new Response(xml, {
        headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            'Content-Type': 'application/xml; charset=utf-8'
        }
    });
};
