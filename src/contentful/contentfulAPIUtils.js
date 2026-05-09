import contentfulClient from '~/contentful/contentfulClient';
import hasContent from '~/utils/hasContent';

export const contentful = contentfulClient(false);

const getContentfulClient = (preview = false) => contentfulClient(preview);

export const fetchAssets = async (tags = [], { preview = false } = {}) => {
    const client = getContentfulClient(preview);

    if (!client) return [];

    const query = {};
    if (tags.length > 0) query['metadata.tags.sys.id[in]'] = tags;

    try {
        const { items = [] } = await client.getAssets(query);

        return items;
    } catch (e) { return []; }
};

export const fetchAssetByTitle = async (title = '', { preview = false } = {}) => {
    const client = getContentfulClient(preview);

    if (!client || !title) return {};

    try {
        const {
            items: [asset = {}] = []
        } = await client.getAssets({
            'fields.title': title,
            limit: 1
        });

        return asset;
    } catch (e) { return {}; }
};

export const fetchAssetByFileName = async (fileName = '', { preview = false } = {}) => {
    const client = getContentfulClient(preview);

    if (!client || !fileName) return {};

    try {
        const {
            items: [asset = {}] = []
        } = await client.getAssets({
            'fields.file.fileName': fileName,
            limit: 1
        });

        return asset;
    } catch (e) { return {}; }
};

export const fetchData = async ({ preview = false } = {}) => {
    const client = getContentfulClient(preview);

    if (!client) return [];

    try {
        const { items = [] } = await client.getEntries({
            content_type: 'pages',
            include: 10
        });

        return items;
    } catch (e) { return []; }
};

export const fetchDataBySlug = async (slug = 'home', { preview = false } = {}) => {
    const client = getContentfulClient(preview);

    if (!client) return {};

    try {
        const {
            items: [content = {}] = []
        } = await client.getEntries({
            content_type: 'pages',
            limit: 1,
            include: 10,
            'fields.slug': slug
        }) || {};

        if (!hasContent(content)) throw new Error('this page is not on this server');

        return content;
    } catch (e) { return {}; }
};

export const generateStaticParams = async ({ preview = false } = {}) => {
    const pages = await fetchData({ preview });
    return pages.map(({
        fields: {
            slug = ''
        } = {}
    }) => ({
        slug: slug ? [slug] : []
    }));
};

export const getMetaDataFromContent = async (pageSlug, { preview = false } = {}) => {
    const {
        fields: {
            seo: {
                fields: {
                    description = ''
                } = {}
            } = {},
            slug: dataSlug = '',
            thumbnail: {
                fields: {
                    file: {
                        url: socialImg = ''
                    } = {}
                } = {}
            } = {},
            title = ''
        } = {},
        sys: {
            updatedAt = ''
        } = {}
    } = await fetchDataBySlug(pageSlug, { preview });

    return {
        description,
        dataSlug,
        socialImg,
        title,
        updatedAt
    };
};
