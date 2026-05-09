import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import Link from 'next/link';
import React from 'react';
import hasContent from '~/utils/hasContent';
import { withPublicBasePath } from '~/utils/publicPath';

const currentYear = new Date().getFullYear();

const replaceVariables = children => React.Children.map(children, (child) => {
    if (typeof child === 'string') return child.replaceAll('%year%', currentYear);
    return child;
});

const getEntryHref = (entry = {}) => {
    const slug = entry?.fields?.slug;

    if (!slug) return '';
    if (slug === 'home') return '/';

    return `/${slug}`;
};

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
        alt: asset?.fields?.description || asset?.fields?.title || file?.fileName || '',
        height: image?.height || undefined,
        src,
        title: asset?.fields?.title || undefined,
        width: image?.width || undefined
    };
};

export default function ContentfulRichText({ richText = {} }) {
    if (!hasContent(richText)) return null;

    return documentToReactComponents(richText, {
        renderMark: {
            [MARKS.BOLD]: children => <strong>{children}</strong>,
            [MARKS.ITALIC]: children => <em>{children}</em>,
            [MARKS.UNDERLINE]: children => <u>{children}</u>,
            [MARKS.CODE]: children => <code>{children}</code>
        },
        renderNode: {
            [BLOCKS.HEADING_1]: (node, children) => <h1>{replaceVariables(children)}</h1>,
            [BLOCKS.HEADING_2]: (node, children) => <h2>{replaceVariables(children)}</h2>,
            [BLOCKS.HEADING_3]: (node, children) => <h3>{replaceVariables(children)}</h3>,
            [BLOCKS.HEADING_4]: (node, children) => <h4>{replaceVariables(children)}</h4>,
            [BLOCKS.HEADING_5]: (node, children) => <h5>{replaceVariables(children)}</h5>,
            [BLOCKS.HEADING_6]: (node, children) => <h6>{replaceVariables(children)}</h6>,
            [BLOCKS.PARAGRAPH]: (node, children) => {
                const processedChildren = replaceVariables(children);

                if (!React.Children.toArray(processedChildren).some(Boolean)) return null;

                return <p>{processedChildren}</p>;
            },
            [BLOCKS.EMBEDDED_ASSET]: (node) => {
                const imageProps = getAssetImageProps(node?.data?.target);

                if (!imageProps.src) return null;

                return (
                    <figure className="rocket-contentful-image">
                        <img
                            alt={imageProps.alt}
                            height={imageProps.height}
                            src={imageProps.src}
                            title={imageProps.title}
                            width={imageProps.width}
                        />
                    </figure>
                );
            },
            [INLINES.HYPERLINK]: (node, children) => {
                const href = node?.data?.uri || '#';
                const isExternal = /^https?:\/\//.test(href);

                return (
                    <a
                        href={withPublicBasePath(href)}
                        rel={isExternal ? 'noreferrer' : undefined}
                        target={isExternal ? '_blank' : undefined}
                    >
                        {replaceVariables(children)}
                    </a>
                );
            },
            [INLINES.ENTRY_HYPERLINK]: (node, children) => {
                const href = getEntryHref(node?.data?.target);

                if (!href) return <span>{replaceVariables(children)}</span>;

                return <Link href={href}>{replaceVariables(children)}</Link>;
            }
        }
    });
}
