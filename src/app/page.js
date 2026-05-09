import React from 'react';
import ContentfulPage from '~/components/ContentfulPage';
import JsonLdScript from '~/components/JsonLdScript';
import StaticHomePage from '~/components/StaticHomePage';
import {
    fetchData,
    fetchDataBySlug,
    getMetaDataFromContent
} from '~/contentful/contentfulAPIUtils';
import { isContentfulPreviewRequest } from '~/contentful/previewUtils';
import { NEXT_PUBLIC_SITE_URL } from '~/state/env';
import { getDraftModeEnabled, isStaticExport } from '~/utils/buildMode';
import hasContent from '~/utils/hasContent';
import { buildPageStructuredData } from '~/utils/structuredData';

const homeSlug = 'home';

export const generateMetadata = async ({ searchParams } = {}) => {
    const isDraftMode = await getDraftModeEnabled();
    const preview = isDraftMode || (!isStaticExport && await isContentfulPreviewRequest(searchParams));
    const {
        dataSlug = '',
        description = '',
        title = '',
        updatedAt = ''
    } = await getMetaDataFromContent(homeSlug, { preview });
    const canonical = new URL('/', NEXT_PUBLIC_SITE_URL || 'https://localhost:3000').toString();

    if (dataSlug !== homeSlug) return {};

    return {
        title,
        description,
        alternates: {
            canonical
        },
        openGraph: {
            title,
            description,
            type: 'website',
            url: canonical,
            ...(updatedAt ? { modifiedTime: updatedAt } : {})
        }
    };
};

export default async function HomePage({ searchParams } = {}) {
    const isDraftMode = await getDraftModeEnabled();
    const preview = isDraftMode || (!isStaticExport && await isContentfulPreviewRequest(searchParams));
    const [
        page,
        pages
    ] = await Promise.all([
        fetchDataBySlug(homeSlug, { preview }),
        fetchData({ preview })
    ]);

    if (!hasContent(page)) return <StaticHomePage />;

    const {
        description = '',
        title = '',
        updatedAt = ''
    } = await getMetaDataFromContent(homeSlug, { preview });
    const pageStructuredData = buildPageStructuredData({
        description,
        pageSlug: homeSlug,
        siteUrl: NEXT_PUBLIC_SITE_URL,
        title,
        updatedAt
    });

    return (
        <>
            <JsonLdScript id="home-page-schema" data={pageStructuredData} />
            <ContentfulPage page={page} pages={pages} />
        </>
    );
}
