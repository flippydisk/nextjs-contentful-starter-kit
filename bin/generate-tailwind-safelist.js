import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Debug } from '@flippydisk/tools';
import { createClient } from 'contentful';

const { env } = process;
const {
    NODE_ENV,
    CONTENTFUL_SPACE_ID: space,
    CONTENTFUL_ENV: environment,
    CONTENTFUL_CONTENT_DELIVERY_API_ACCESS_TOKEN: accessToken,
    CONTENTFUL_CONTENT_PREVIEW_API_ACCESS_TOKEN: previewAccessToken
} = env;

const isPreview = NODE_ENV === 'development';
const resolvedAccessToken = isPreview ? (previewAccessToken || accessToken) : accessToken;
const usePreviewHost = isPreview && Boolean(previewAccessToken);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, '../src/themes/all/generated-safelist.css');
const debug = new Debug({ control: 'GenerateTailwindSafelist', debug: false });

const allowedPrefixes = [
    '-bottom-',
    '-left-',
    '-right-',
    '-top-',
    '-translate-x-',
    '-translate-y-',
    '-z-',
    'absolute',
    'basis-',
    'bg-',
    'block',
    'border',
    'bottom-',
    'content-',
    'fill-',
    'fixed',
    'flex',
    'float-',
    'gap-',
    'gap-x-',
    'gap-y-',
    'grid',
    'grow',
    'grow-',
    'h-',
    'hidden',
    'inline',
    'items-',
    'italic',
    'justify-',
    'left-',
    'm-',
    'max-h-',
    'max-w-',
    'mb-',
    'min-h-',
    'min-w-',
    'ml-',
    'mr-',
    'mt-',
    'mx-',
    'my-',
    'no-underline',
    'object-',
    'opacity-',
    'order-',
    'overflow',
    'overflow-',
    'p-',
    'pb-',
    'pl-',
    'pr-',
    'pt-',
    'px-',
    'py-',
    'relative',
    'right-',
    'rounded',
    'self-',
    'shrink',
    'shrink-',
    'sticky',
    'stroke-',
    'text-',
    'text-shadow',
    'text-shadow-',
    'top-',
    'translate-x-',
    'translate-y-',
    'underline',
    'w-',
    'z-'
];

const variantPrefixes = [
    'hover',
    'focus',
    'active',
    'disabled',
    'sm',
    'md',
    'lg',
    'xl',
    '2xl',
    '3xl',
    'xxs',
    'xs'
];

const classFields = new Set([
    'className',
    'iconClasses',
    'liClass',
    'liClassHover',
    'linkClasses',
    'linkDecoration',
    'linkDecorationHover',
    'linkFont',
    'textAlignment',
    'textMargin',
    'textBoldMargin',
    'heading1Customize',
    'heading1Margin',
    'heading1Alignment',
    'heading2Customize',
    'heading2Margin',
    'heading2Alignment',
    'heading3Margin',
    'heading3Alignment',
    'heading4Margin',
    'heading4Alignment',
    'heading5Margin',
    'heading5Alignment',
    'heading6Margin',
    'heading6Alignment',
    'paragraphCustomize',
    'ulClass',
    'listItemMargin',
    'marksBoldWeight',
    'codeMargin'
]);

const tokenPattern = /[^\s]+/g;

const stripVariants = (token) => {
    const parts = token.split(':');
    let base = parts.at(-1);

    while (parts.length > 1 && variantPrefixes.includes(parts[0])) {
        parts.shift();
        base = parts.at(-1);
    }

    return base;
};

const isTailwindToken = (token) => {
    if (!token || token.includes('%')) return false;
    if (/^[A-Z]/.test(token)) return false;
    if (/[^a-z0-9:[\]/.%_-]/i.test(token)) return false;

    const baseToken = stripVariants(token);

    if (baseToken.startsWith('content-')) {
        return /^content-(center|start|end|between|around|evenly|baseline|stretch|normal)$/.test(baseToken);
    }

    return allowedPrefixes.some(prefix => baseToken === prefix || baseToken.startsWith(prefix));
};

const collectTokens = (input, tokens) => {
    if (typeof input !== 'string') return;

    const matches = input.match(tokenPattern) || [];
    matches.forEach((token) => {
        if (isTailwindToken(token)) tokens.add(token);
    });
};

const addStructuredToken = (token, tokens) => {
    if (token && isTailwindToken(token)) tokens.add(token);
};

const collectStructuredLayoutTokens = (value, tokens) => {
    if (!value || typeof value !== 'object') return;

    const fields = value.fields || {};
    const breakpointPrefix = fields.breakpointPrefix?.fields?.value || '';
    const valuePrefix = fields.valuePrefix || '';
    const valueSuffix = fields.valueSuffix?.fields?.value || '';
    const locationPrefix = fields.locationPrefix || '';
    const locationSuffix = fields.locationSuffix?.fields?.value || '';
    const positionValue = fields.positionValue || '';
    const stacking = fields.stacking || '';
    const positiveOrNegative = fields.valuePositiveOrNegative || '+';
    const gapValue = fields.gap?.fields?.value || '';
    const opacityValue = fields.opacity || '';

    if (valuePrefix && valueSuffix) {
        const classToken = `${valuePrefix}-${valueSuffix}`;
        addStructuredToken(breakpointPrefix ? `${breakpointPrefix}:${classToken}` : classToken, tokens);
    }

    if (positionValue) {
        addStructuredToken(breakpointPrefix ? `${breakpointPrefix}:${positionValue}` : positionValue, tokens);
    }

    if (locationPrefix && locationSuffix) {
        const positionToken = `${positiveOrNegative === '-' ? '-' : ''}${locationPrefix}-${locationSuffix}`;
        addStructuredToken(breakpointPrefix ? `${breakpointPrefix}:${positionToken}` : positionToken, tokens);
    }

    if (stacking) {
        const stackToken = `${positiveOrNegative === '-' ? '-' : ''}z-${stacking}`;
        addStructuredToken(breakpointPrefix ? `${breakpointPrefix}:${stackToken}` : stackToken, tokens);
    }

    if (gapValue) {
        const gapToken = `gap-${gapValue}`;
        addStructuredToken(breakpointPrefix ? `${breakpointPrefix}:${gapToken}` : gapToken, tokens);
    }

    if (opacityValue) {
        const opacityToken = `opacity-${opacityValue}`;
        addStructuredToken(opacityToken, tokens);
    }
};

const walk = (value, tokens, seen = new WeakSet(), key = '') => {
    if (Array.isArray(value)) {
        value.forEach(item => walk(item, tokens, seen, key));
        return;
    }

    if (value && typeof value === 'object') {
        if (seen.has(value)) return;
        seen.add(value);

        collectStructuredLayoutTokens(value, tokens);

        Object.entries(value).forEach(([childKey, childValue]) => {
            walk(childValue, tokens, seen, childKey);
        });
        return;
    }

    if (typeof value !== 'string') return;

    collectTokens(value, tokens);

    if (classFields.has(key) || /^(?:heading|paragraph|text|list|code|marks|link)/.test(key)) {
        collectTokens(value, tokens);
    }
};

const fetchAllPages = async (client) => {
    const { items = [] } = await client.getEntries({
        content_type: 'pages',
        include: 10,
        limit: 1000
    });

    return items;
};

const generateSafelistCss = (tokens) => {
    const lines = [
        '/* Auto-generated by bin/generate-tailwind-safelist.js */',
        '/* Do not edit manually. */',
        ''
    ];

    [...tokens].sort().forEach((token) => {
        lines.push(`@source inline('${token}');`);
    });

    lines.push('');
    return lines.join('\n');
};

const main = async () => {
    if (!space || !environment || !resolvedAccessToken) {
        debug.info('Skipping Tailwind safelist generation; Contentful environment variables are not configured for this run.');
        return;
    }

    const client = createClient({
        space,
        environment,
        accessToken: resolvedAccessToken,
        ...(usePreviewHost ? { host: 'preview.contentful.com' } : {})
    });

    const pages = await fetchAllPages(client);
    const tokens = new Set();

    pages.forEach(page => walk(page, tokens));

    await writeFile(outputPath, generateSafelistCss(tokens), 'utf8');
    debug.info(`Generated Tailwind safelist with ${tokens.size} tokens at ${outputPath}`);
};

main().catch((error) => {
    debug.error(error?.stack || error);
    process.exitCode = 1;
});
