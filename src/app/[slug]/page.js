import { notFound } from 'next/navigation';
import React from 'react';
import ContentfulPage from '~/components/ContentfulPage';
import JsonLdScript from '~/components/JsonLdScript';
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

export const generateStaticParams = async () => {
    const pages = await fetchData();

    return pages
        .map(({ fields: { slug = '' } = {} }) => ({ slug }))
        .filter(({ slug }) => slug && slug !== 'home' && slug !== '404');
};

export const generateMetadata = async ({
    params,
    searchParams
} = {}) => {
    const isDraftMode = await getDraftModeEnabled();
    const preview = isDraftMode || (!isStaticExport && await isContentfulPreviewRequest(searchParams));
    const {
        slug = ''
    } = await params;
    const {
        dataSlug = '',
        description = '',
        title = '',
        updatedAt = ''
    } = await getMetaDataFromContent(slug, { preview });
    const canonicalPath = dataSlug && dataSlug !== 'home' ? `/${dataSlug}` : '/';
    const canonical = new URL(canonicalPath, NEXT_PUBLIC_SITE_URL || 'https://localhost:3000').toString();

    if (!dataSlug || dataSlug !== slug) return {};

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

export default async function DynamicContentfulPage({
    params,
    searchParams
} = {}) {
    const isDraftMode = await getDraftModeEnabled();
    const preview = isDraftMode || (!isStaticExport && await isContentfulPreviewRequest(searchParams));
    const {
        slug = ''
    } = await params;
    const [
        page,
        pages
    ] = await Promise.all([
        fetchDataBySlug(slug, { preview }),
        fetchData({ preview })
    ]);

    if (!hasContent(page)) return notFound();

    const {
        description = '',
        title = '',
        updatedAt = ''
    } = await getMetaDataFromContent(slug, { preview });
    const pageStructuredData = buildPageStructuredData({
        description,
        pageSlug: slug,
        siteUrl: NEXT_PUBLIC_SITE_URL,
        title,
        updatedAt
    });

    return (
        <>
            <JsonLdScript id={`${slug}-page-schema`} data={pageStructuredData} />
            <ContentfulPage page={page} pages={pages} />
        </>
    );
}
