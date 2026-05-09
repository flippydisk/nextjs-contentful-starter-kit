import React from 'react';
import ContentfulPage from '~/components/ContentfulPage';
import JsonLdScript from '~/components/JsonLdScript';
import StaticNotFoundPage from '~/components/StaticNotFoundPage';
import {
    fetchData,
    fetchDataBySlug
} from '~/contentful/contentfulAPIUtils';
import { isContentfulPreviewRequest } from '~/contentful/previewUtils';
import { NEXT_PUBLIC_SITE_URL } from '~/state/env';
import { getDraftModeEnabled, isStaticExport } from '~/utils/buildMode';
import hasContent from '~/utils/hasContent';
import { buildPageStructuredData } from '~/utils/structuredData';

export default async function NotFoundPage({ searchParams } = {}) {
    const isDraftMode = await getDraftModeEnabled();
    const preview = isDraftMode || (!isStaticExport && await isContentfulPreviewRequest(searchParams));
    const [
        page,
        pages
    ] = await Promise.all([
        fetchDataBySlug('404', { preview }),
        fetchData({ preview })
    ]);

    if (!hasContent(page)) return <StaticNotFoundPage />;

    const description = page?.fields?.seo?.fields?.description || 'The requested page was not found.';
    const title = page?.fields?.title || 'Page Not Found';
    const updatedAt = page?.sys?.updatedAt || '';
    const pageStructuredData = buildPageStructuredData({
        description,
        pageSlug: '404',
        siteUrl: NEXT_PUBLIC_SITE_URL,
        title,
        updatedAt
    });

    return (
        <>
            <JsonLdScript id="not-found-page-schema" data={pageStructuredData} />
            <ContentfulPage page={page} pages={pages} />
        </>
    );
}
