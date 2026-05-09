'use client';

import { useContentfulInspectorMode, useContentfulLiveUpdates } from '@contentful/live-preview/react';
import Link from 'next/link';
import React from 'react';
import ContentfulRichText from '~/components/ContentfulRichText';
import RocketDisclosure from '~/components/RocketDisclosure';
import StarterCredit from '~/components/StarterCredit';
import ThemeSwitcher from '~/components/ThemeSwitcher';

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
    const logoAsset = header?.fields?.assets?.[0];
    const logoProps = getAssetImageProps(logoAsset);

    return (
        <>
            <header aria-label="Site header">
                <figure>
                    <Link href="/">
                        <img
                            alt={logoProps.alt}
                            height={logoProps.height}
                            loading="eager"
                            fetchPriority="high"
                            src={logoProps.src}
                            title={logoProps.title}
                            width={logoProps.width}
                        />
                    </Link>
                    <figcaption aria-hidden="true" />
                    <span className="sr-only">Rocket themed Next.js starter kit</span>
                </figure>
            </header>
            <div>
                <menu aria-label="Page navigation">
                    <li>
                        <section aria-labelledby="contentful-theme-menu-heading">
                            <RocketDisclosure
                                controlsId="contentful-theme-menu-panel"
                                summary="Theme"
                                summaryId="contentful-theme-menu-heading"
                            >
                                <ThemeSwitcher />
                            </RocketDisclosure>
                        </section>
                    </li>
                    <li>
                        <section aria-labelledby="contentful-page-menu-heading">
                            <RocketDisclosure
                                controlsId="contentful-page-menu-panel"
                                summary="Pages"
                                summaryId="contentful-page-menu-heading"
                            >
                                <nav aria-label="Contentful pages">
                                    <ul>
                                        {visiblePages.map(({ fields: { slug = '', title: pageTitle = '' } = {} }) => (
                                            <li key={slug || pageTitle}>
                                                <Link href={getPageHref(slug)}>{pageTitle || slug || 'Home'}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </RocketDisclosure>
                        </section>
                    </li>
                    <li>
                        <section aria-labelledby="contentful-links-menu-heading">
                            <RocketDisclosure
                                controlsId="contentful-links-menu-panel"
                                summary="Links"
                                summaryId="contentful-links-menu-heading"
                            >
                                <nav aria-label="Useful project links">
                                    <ul>
                                        <li>
                                            <a href="https://nextjs.org/docs" rel="noreferrer" target="_blank">Next.js Docs</a>
                                        </li>
                                        <li>
                                            <a href="https://www.contentful.com/developers/docs/" rel="noreferrer" target="_blank">Contentful Docs</a>
                                        </li>
                                        <li>
                                            <a href="https://app.contentful.com/account/profile/cma_tokens" rel="noreferrer" target="_blank">CMA Tokens</a>
                                        </li>
                                        <li>
                                            <a href="https://github.com/FiloSottile/mkcert#installation" rel="noreferrer" target="_blank">mkcert Install</a>
                                        </li>
                                    </ul>
                                </nav>
                            </RocketDisclosure>
                        </section>
                    </li>
                    <li>
                        <section aria-labelledby="contentful-commands-menu-heading">
                            <RocketDisclosure
                                controlsId="contentful-commands-menu-panel"
                                summary="Commands"
                                summaryId="contentful-commands-menu-heading"
                            >
                                <ul aria-label="Common npm commands">
                                    <li><code>npm run dev</code></li>
                                    <li><code>npm run test</code></li>
                                    <li><code>npm run build</code></li>
                                    <li><code>npm run contentful:import</code></li>
                                </ul>
                            </RocketDisclosure>
                        </section>
                    </li>
                </menu>
                <main aria-label={title}>
                    {content.map((component, index) => {
                        const componentId = getComponentId(component, index);
                        const headingId = `${componentId}-heading`;
                        const panelId = `${componentId}-panel`;

                        return (
                            <section
                                {...inspectorProps({
                                    entryId: componentId,
                                    fieldId: 'content'
                                })}
                                aria-labelledby={headingId}
                                key={componentId}
                            >
                                <RocketDisclosure
                                    controlsId={panelId}
                                    summary={getComponentSummary(component, title)}
                                    summaryId={headingId}
                                >
                                    <article className="rocket-readme">
                                        <ContentfulRichText richText={component?.fields?.content} />
                                    </article>
                                </RocketDisclosure>
                            </section>
                        );
                    })}
                    {!content.length ? (
                        <section aria-labelledby="contentful-page-heading">
                            <RocketDisclosure
                                controlsId="contentful-page-panel"
                                summary={title}
                                summaryId="contentful-page-heading"
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
                            </RocketDisclosure>
                        </section>
                    ) : null}
                    {footer ? (
                        <section
                            {...inspectorProps({
                                entryId: footer?.sys?.id,
                                fieldId: 'linkedEntries'
                            })}
                            aria-labelledby="contentful-footer-heading"
                        >
                            <RocketDisclosure
                                controlsId="contentful-footer-panel"
                                summary="Footer"
                                summaryId="contentful-footer-heading"
                            >
                                <footer className="rocket-readme rocket-contentful-footer" aria-label="Site footer">
                                    <nav aria-label="Footer links">
                                        <ContentfulRichText richText={links?.fields?.content} />
                                    </nav>
                                    <ContentfulRichText richText={trademark?.fields?.content} />
                                </footer>
                            </RocketDisclosure>
                        </section>
                    ) : null}
                    <StarterCredit />
                </main>
            </div>
        </>
    );
}
