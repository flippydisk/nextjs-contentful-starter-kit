const defaultSiteOrigin = 'https://localhost:3000';
const defaultImagePath = '/themes/rocket/logo.png';
const defaultSiteName = 'Next.js Contentful Starter Kit';

const trimSlashes = (value = '') => `${value || ''}`.replace(/^\/+|\/+$/gu, '');

const compactObject = (value = {}) => Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => {
        if (Array.isArray(entryValue)) return entryValue.length > 0;
        return entryValue !== undefined && entryValue !== null && entryValue !== '';
    })
);

const titleizeSlugSegment = (value = '') => trimSlashes(value)
    .split('-')
    .filter(Boolean)
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');

export const getSiteOrigin = (siteUrl = '') => {
    const normalizedSiteUrl = `${siteUrl || ''}`.trim().replace(/\/+$/gu, '');

    if (!normalizedSiteUrl) return defaultSiteOrigin;

    return /^https?:\/\//iu.test(normalizedSiteUrl)
        ? normalizedSiteUrl
        : `https://${normalizedSiteUrl}`;
};

export const buildAbsoluteUrl = ({
    path = '',
    siteUrl = ''
} = {}) => {
    const siteOrigin = getSiteOrigin(siteUrl);
    const normalizedPath = `${path || ''}`.trim();

    if (!normalizedPath || normalizedPath === 'home') return siteOrigin;
    if (normalizedPath.startsWith('//')) return `https:${normalizedPath}`;
    if (/^https?:\/\//iu.test(normalizedPath)) return normalizedPath.replace(/\/+$/gu, '');

    return `${siteOrigin}/${trimSlashes(normalizedPath)}`;
};

export const buildSiteStructuredData = ({
    description = '',
    image = defaultImagePath,
    name = defaultSiteName,
    sameAs = [],
    siteUrl = ''
} = {}) => {
    const siteOrigin = getSiteOrigin(siteUrl);
    const logoUrl = buildAbsoluteUrl({
        path: image,
        siteUrl
    });

    return {
        '@context': 'https://schema.org',
        '@graph': [
            compactObject({
                '@type': 'Organization',
                '@id': `${siteOrigin}/#organization`,
                name,
                url: siteOrigin,
                logo: logoUrl,
                sameAs
            }),
            compactObject({
                '@type': 'WebSite',
                '@id': `${siteOrigin}/#website`,
                name,
                url: siteOrigin,
                description,
                publisher: {
                    '@id': `${siteOrigin}/#organization`
                },
                inLanguage: 'en-US'
            })
        ]
    };
};

export const buildPageStructuredData = ({
    description = '',
    image = defaultImagePath,
    pageSlug = 'home',
    siteUrl = '',
    title = '',
    updatedAt = ''
} = {}) => {
    const siteOrigin = getSiteOrigin(siteUrl);
    const canonicalUrl = buildAbsoluteUrl({
        path: pageSlug,
        siteUrl
    });
    const imageUrl = image ? buildAbsoluteUrl({
        path: image,
        siteUrl
    }) : '';
    const isHomePage = !pageSlug || pageSlug === 'home';
    const graph = [
        compactObject({
            '@type': 'WebPage',
            '@id': `${canonicalUrl}#webpage`,
            url: canonicalUrl,
            name: title,
            description,
            isPartOf: {
                '@id': `${siteOrigin}/#website`
            },
            publisher: {
                '@id': `${siteOrigin}/#organization`
            },
            primaryImageOfPage: imageUrl
                ? {
                    '@type': 'ImageObject',
                    url: imageUrl
                }
                : undefined,
            dateModified: updatedAt,
            inLanguage: 'en-US'
        })
    ];

    if (!isHomePage) {
        const segments = trimSlashes(pageSlug).split('/').filter(Boolean);
        const itemListElement = [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: siteOrigin
            },
            ...segments.map((segment, index) => {
                const href = buildAbsoluteUrl({
                    path: segments.slice(0, index + 1).join('/'),
                    siteUrl
                });
                const isCurrentPage = index === segments.length - 1;

                return {
                    '@type': 'ListItem',
                    position: index + 2,
                    name: isCurrentPage ? title || titleizeSlugSegment(segment) : titleizeSlugSegment(segment),
                    item: href
                };
            })
        ];

        graph.push({
            '@type': 'BreadcrumbList',
            '@id': `${canonicalUrl}#breadcrumb`,
            itemListElement
        });
    }

    return {
        '@context': 'https://schema.org',
        '@graph': graph
    };
};
