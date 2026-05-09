import { CONTENTFUL_PREVIEW_SECRET } from '~/state/env';

export const previewSearchParam = 'contentful_preview';

export const getSearchParam = async (searchParams = {}, key = '') => {
    const params = await searchParams;
    const value = params?.[key];

    if (Array.isArray(value)) return value[0] || '';

    return value || '';
};

export const isContentfulPreviewRequest = async (searchParams = {}) => {
    const previewSecret = await getSearchParam(searchParams, previewSearchParam);

    return Boolean(CONTENTFUL_PREVIEW_SECRET && previewSecret === CONTENTFUL_PREVIEW_SECRET);
};
