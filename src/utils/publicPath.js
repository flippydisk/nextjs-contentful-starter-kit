import { NEXT_PUBLIC_BASE_PATH } from '~/state/env';

const normalizeBasePath = (basePath = '') => {
    if (!basePath || basePath === '/') return '';

    return `/${basePath.replace(/^\/+|\/+$/g, '')}`;
};

export const withPublicBasePath = (href = '') => {
    if (!href || !href.startsWith('/') || href.startsWith('//')) return href;

    const basePath = normalizeBasePath(NEXT_PUBLIC_BASE_PATH);

    if (!basePath || href === basePath || href.startsWith(`${basePath}/`)) return href;
    if (href === '/') return `${basePath}/`;

    return `${basePath}${href}`;
};
