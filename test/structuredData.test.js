import {
    buildAbsoluteUrl,
    buildPageStructuredData,
    buildSiteStructuredData,
    getSiteOrigin
} from '~/utils/structuredData';

describe('structuredData utilities', () => {
    it('normalizes site origins', () => {
        expect(getSiteOrigin()).toBe('https://localhost:3000');
        expect(getSiteOrigin('starter.example.com/')).toBe('https://starter.example.com');
        expect(getSiteOrigin('http://localhost:4000/')).toBe('http://localhost:4000');
    });

    it('builds absolute URLs from common Contentful paths', () => {
        expect(buildAbsoluteUrl({ siteUrl: 'example.com', path: 'home' })).toBe('https://example.com');
        expect(buildAbsoluteUrl({ siteUrl: 'example.com', path: '/privacy/' })).toBe('https://example.com/privacy');
        expect(buildAbsoluteUrl({ siteUrl: 'example.com', path: '//images.ctfassets.net/logo.png' })).toBe('https://images.ctfassets.net/logo.png');
        expect(buildAbsoluteUrl({ siteUrl: 'example.com', path: 'https://cdn.example.com/logo.png/' })).toBe('https://cdn.example.com/logo.png');
    });

    it('builds site JSON-LD and omits empty optional values', () => {
        const data = buildSiteStructuredData({
            description: '',
            image: '/logo.png',
            name: 'Starter',
            sameAs: [],
            siteUrl: 'starter.example.com'
        });

        expect(data['@context']).toBe('https://schema.org');
        expect(data['@graph']).toEqual([
            {
                '@type': 'Organization',
                '@id': 'https://starter.example.com/#organization',
                name: 'Starter',
                url: 'https://starter.example.com',
                logo: 'https://starter.example.com/logo.png'
            },
            {
                '@type': 'WebSite',
                '@id': 'https://starter.example.com/#website',
                name: 'Starter',
                url: 'https://starter.example.com',
                publisher: {
                    '@id': 'https://starter.example.com/#organization'
                },
                inLanguage: 'en-US'
            }
        ]);
    });

    it('builds page JSON-LD with breadcrumbs for nested slugs', () => {
        const data = buildPageStructuredData({
            description: 'Privacy policy',
            image: '',
            pageSlug: 'legal/privacy',
            siteUrl: 'https://starter.example.com/',
            title: 'Privacy',
            updatedAt: '2026-05-08T00:00:00.000Z'
        });

        expect(data['@graph'][0]).toMatchObject({
            '@type': 'WebPage',
            '@id': 'https://starter.example.com/legal/privacy#webpage',
            url: 'https://starter.example.com/legal/privacy',
            name: 'Privacy',
            description: 'Privacy policy',
            dateModified: '2026-05-08T00:00:00.000Z'
        });
        expect(data['@graph'][0]).not.toHaveProperty('primaryImageOfPage');
        expect(data['@graph'][1]).toEqual({
            '@type': 'BreadcrumbList',
            '@id': 'https://starter.example.com/legal/privacy#breadcrumb',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://starter.example.com'
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Legal',
                    item: 'https://starter.example.com/legal'
                },
                {
                    '@type': 'ListItem',
                    position: 3,
                    name: 'Privacy',
                    item: 'https://starter.example.com/legal/privacy'
                }
            ]
        });
    });

    it('does not add breadcrumbs for the home page', () => {
        const data = buildPageStructuredData({
            pageSlug: 'home',
            siteUrl: 'starter.example.com',
            title: 'Home'
        });

        expect(data['@graph']).toHaveLength(1);
        expect(data['@graph'][0].url).toBe('https://starter.example.com');
    });
});
