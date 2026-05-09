import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter, Merriweather } from 'next/font/google';
import React from 'react';
import ContentfulLivePreview from '~/components/ContentfulLivePreview';
import JsonLdScript from '~/components/JsonLdScript';
import { fetchAssetByFileName, fetchAssetByTitle } from '~/contentful/contentfulAPIUtils';
import { CONTENTFUL_ENV, CONTENTFUL_SPACE_ID, NEXT_PUBLIC_SITE_SLOGAN, NEXT_PUBLIC_SITE_URL } from '~/state/env';
import { getDraftModeEnabled, isStaticExport } from '~/utils/buildMode';
import { buildSiteStructuredData } from '~/utils/structuredData';
import { themeInitScript } from '~/utils/themeConfig';
import '~/themes/all/tailwind.css';
import '~/themes/all/fonts.scss';
import '~/themes/rocket/generated.scss';
import '~/themes/atlas/generated.scss';

const isVercelProductionDeployment = process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production';
const siteUrl = NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
const bodyFont = Inter({
    subsets: ['latin'],
    variable: '--font-body'
});
const displayFont = Merriweather({
    subsets: ['latin'],
    variable: '--font-display',
    weight: ['400', '700']
});
const siteName = 'Next.js Contentful Starter Kit';
const siteDescription = NEXT_PUBLIC_SITE_SLOGAN || 'Next.js starter kit with Contentful, Tailwind, SCSS, Jest, and local HTTPS.';
const siteStructuredData = buildSiteStructuredData({
    description: siteDescription,
    name: siteName,
    siteUrl
});
const fallbackFavicon = '/themes/rocket/favicon.ico';

const normalizeContentfulAssetUrl = (url = '') => {
    if (!url) return '';
    if (url.startsWith('//')) return `https:${url}`;

    return url;
};

export const generateMetadata = async () => {
    const faviconAsset = await fetchAssetByFileName('favicon.ico') || await fetchAssetByTitle('favicon.ico') || await fetchAssetByTitle('favicon');
    const contentfulFavicon = normalizeContentfulAssetUrl(faviconAsset?.fields?.file?.url);

    return {
        metadataBase: new URL(siteUrl),
        title: {
            default: siteName,
            template: `%s | ${siteName}`
        },
        description: siteDescription,
        icons: {
            icon: contentfulFavicon || fallbackFavicon
        }
    };
};

export default async function RootLayout({ children }) {
    const isDraftMode = await getDraftModeEnabled();
    const hasContentfulLivePreviewConfig = !isStaticExport && Boolean(CONTENTFUL_ENV && CONTENTFUL_SPACE_ID);

    return (
        <html lang="en" dir="ltr" data-theme="rocket" className={`${bodyFont.variable} ${displayFont.variable}`}>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
            </head>
            <body suppressHydrationWarning className={bodyFont.className}>
                <ContentfulLivePreview
                    enabled={isDraftMode || hasContentfulLivePreviewConfig}
                    environment={CONTENTFUL_ENV}
                    space={CONTENTFUL_SPACE_ID}
                >
                    <JsonLdScript id="site-schema" data={siteStructuredData} />
                    {children}
                    {isVercelProductionDeployment ? <SpeedInsights /> : null}
                </ContentfulLivePreview>
            </body>
        </html>
    );
}
