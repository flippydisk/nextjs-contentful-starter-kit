'use client';

import { useContentfulInspectorMode, useContentfulLiveUpdates } from '@contentful/live-preview/react';
import React from 'react';
import ContentfulRichText from '~/components/ContentfulRichText';
import RocketPageShell, { RocketDisclosureSection, starterProjectLinks } from '~/components/RocketPageShell';

const isTagged = (entry = {}, tagId = '') => (entry?.metadata?.tags || []).some(tag => tag?.sys?.id === tagId);

const normalizeAssetUrl = (url = '') => {
    if (!url) return '';
    if (url.startsWith('//')) return `https:${url}`;

    return url;
};

const getAssetImageProps = (asset = {}) => {
    const file = asset?.fields?.file || {};
    const image = file?.details?.image || {};
    const src = normalizeAssetUrl(file?.url);

    return {
        alt: asset?.fields?.description || asset?.fields?.title || file?.fileName || 'Site logo',
        height: 74,
        src: src || '/themes/rocket/logo.png',
        title: asset?.fields?.title || undefined,
        width: 300
    };
};

const getPageParts = (page = {}) => {
    const pageComponents = page?.fields?.pageComponents || [];
    const header = pageComponents.find(component => isTagged(component, 'globalHeader'));
    const footer = pageComponents.find(component => isTagged(component, 'globalFooter'));
    const content = pageComponents.filter(component => !isTagged(component, 'globalHeader') && !isTagged(component, 'globalFooter'));

    return {
        content,
        footer,
        header
    };
};

const getFooterParts = (footer = {}) => {
    const linkedEntries = footer?.fields?.linkedEntries || [];

    return {
        links: linkedEntries.find(entry => `${entry?.fields?.slug || ''}`.includes('footer-links')),
        trademark: linkedEntries.find(entry => `${entry?.fields?.slug || ''}`.includes('footer-trademark'))
    };
};

const getComponentSummary = (component = {}, fallback = 'Content') => {
    const name = component?.fields?.name || '';
    const slug = component?.fields?.slug || '';
    const cleanedName = name
        .replace(/^Content Block\s*-\s*/i, '')
        .replace(/^Page Component\s*:\s*/i, '')
        .trim();

    if (cleanedName) return cleanedName;
    if (slug) return slug.replaceAll('-', ' ');

    return fallback;
};

const getComponentId = (component = {}, index) => component?.sys?.id || `contentful-component-${index}`;

const getPageHref = (slug = '') => {
    if (!slug || slug === 'home') return '/';

    return `/${slug}`;
};

const getVisiblePages = (pages = []) => pages.filter(({ fields: { slug = '' } = {} }) => slug !== '404');
const contentfulProjectLinks = starterProjectLinks.slice(0, 4);

export default function ContentfulPage({
    page = {},
    pages = []
}) {
    const livePage = useContentfulLiveUpdates(page);
    const livePages = useContentfulLiveUpdates(pages);
    const inspectorProps = useContentfulInspectorMode();
    const {
        content,
        footer,
        header
    } = getPageParts(livePage);
    const {
        links,
        trademark
    } = getFooterParts(footer);
    const title = livePage?.fields?.title || 'Contentful page';
    const visiblePages = getVisiblePages(livePages);
    const pageLinks = visiblePages.map(({ fields: { slug = '', title: pageTitle = '' } = {} }) => ({
        href: getPageHref(slug),
        label: pageTitle || slug || 'Home'
    }));
    const logoAsset = header?.fields?.assets?.[0];
    const logoProps = getAssetImageProps(logoAsset);

    return (
        <RocketPageShell
            idPrefix="contentful"
            logo={logoProps}
            mainAriaLabel={title}
            pageLinks={pageLinks}
            pageLinksLabel="Contentful pages"
            pageMenuId="contentful-page-menu"
            projectLinks={contentfulProjectLinks}
            showStaticFooter={false}
        >
            {content.map((component, index) => {
                const componentId = getComponentId(component, index);

                return (
                    <RocketDisclosureSection
                        id={componentId}
                        key={componentId}
                        sectionProps={inspectorProps({
                            entryId: componentId,
                            fieldId: 'content'
                        })}
                        summary={getComponentSummary(component, title)}
                    >
                        <article className="rocket-readme">
                            <ContentfulRichText richText={component?.fields?.content} />
                        </article>
                    </RocketDisclosureSection>
                );
            })}
            {!content.length ? (
                <RocketDisclosureSection
                    id="contentful-page"
                    summary={title}
                >
                    <article className="rocket-readme">
                        <ContentfulRichText
                            richText={{
                                nodeType: 'document',
                                data: {},
                                content: []
                            }}
                        />
                    </article>
                </RocketDisclosureSection>
            ) : null}
            {footer ? (
                <RocketDisclosureSection
                    id="contentful-footer"
                    sectionProps={inspectorProps({
                        entryId: footer?.sys?.id,
                        fieldId: 'linkedEntries'
                    })}
                    summary="Footer"
                >
                    <footer className="rocket-readme rocket-contentful-footer" aria-label="Site footer">
                        <nav aria-label="Footer links">
                            <ContentfulRichText richText={links?.fields?.content} />
                        </nav>
                        <ContentfulRichText richText={trademark?.fields?.content} />
                    </footer>
                </RocketDisclosureSection>
            ) : null}
        </RocketPageShell>
    );
}
