import fs from 'node:fs';
import path from 'node:path';
import { Debug } from '@flippydisk/tools';
import contentfulExport from 'contentful-export';
import { getContentfulConfig, rootDir } from './contentful-env.js';

const outputDir = path.join(rootDir, 'contentful-skeleton');
const contentFile = 'contentful-skeleton.json';
const debug = new Debug({ control: 'ExportContentfulSkeleton', debug: false });

const cleanDownloadedAssets = () => {
    if (!fs.existsSync(outputDir)) return;

    for (const item of fs.readdirSync(outputDir, { withFileTypes: true })) {
        if (!item.isDirectory()) continue;

        fs.rmSync(path.join(outputDir, item.name), {
            force: true,
            recursive: true
        });
    }
};

const normalizeAssetUrl = (url = '') => {
    if (!url) return '';
    if (url.startsWith('//')) return `https:${url}`;

    return url;
};

const walkFiles = (dir) => {
    if (!fs.existsSync(dir)) return [];

    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) return walkFiles(fullPath);

        return fullPath;
    });
};

const getLocalAssetPath = (baseDir, url = '') => {
    const normalizedUrl = normalizeAssetUrl(url);
    if (!normalizedUrl) return '';

    const parsedUrl = new URL(normalizedUrl);

    return path.join(baseDir, parsedUrl.host, decodeURIComponent(parsedUrl.pathname));
};

const getSkeletonAssetFiles = (assets = []) => assets.flatMap((asset) => {
    return Object.values(asset?.fields?.file || {}).map((file) => {
        const url = file?.url || file?.upload || '';

        return {
            assetId: asset?.sys?.id || '',
            fileName: file?.fileName || '',
            localPath: getLocalAssetPath(outputDir, url)
        };
    });
});

const pruneDownloadedAssetFiles = (assets = []) => {
    const keptPaths = new Set(getSkeletonAssetFiles(assets).map(({ localPath }) => localPath));

    for (const filePath of walkFiles(outputDir)) {
        if (filePath === path.join(outputDir, contentFile)) continue;
        if (keptPaths.has(filePath)) continue;

        fs.rmSync(filePath, { force: true });
    }
};

const removeEmptyDirectories = (dir = outputDir) => {
    if (!fs.existsSync(dir)) return;

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;

        removeEmptyDirectories(path.join(dir, entry.name));
    }

    if (dir !== outputDir && fs.readdirSync(dir).length === 0) {
        fs.rmdirSync(dir);
    }
};

const validateDownloadedAssetFiles = (assets = []) => {
    const missingFiles = getSkeletonAssetFiles(assets).filter(({ localPath }) => !fs.existsSync(localPath));

    if (!missingFiles.length) return;

    throw new Error(
        `Contentful skeleton export is missing local media files: ${missingFiles.map(({ assetId, fileName }) => `${assetId}/${fileName}`).join(', ')}`
    );
};

const collectLinks = (value, links = { assets: new Set(), entries: new Set() }) => {
    if (Array.isArray(value)) {
        value.forEach(item => collectLinks(item, links));
        return links;
    }

    if (!value || typeof value !== 'object') return links;

    if (value.sys?.type === 'Link' && value.sys?.id) {
        if (value.sys.linkType === 'Asset') links.assets.add(value.sys.id);
        if (value.sys.linkType === 'Entry') links.entries.add(value.sys.id);

        return links;
    }

    Object.values(value).forEach(item => collectLinks(item, links));

    return links;
};

const isPageBySlug = (entry, slug) => {
    const contentTypeId = entry.sys?.contentType?.sys?.id;
    const slugValues = Object.values(entry.fields?.slug || {});

    return contentTypeId === 'pages' && slugValues.includes(slug);
};

const filterLocalizedEntryLinks = (localizedValue, allowedEntryIds) => {
    if (!localizedValue) return localizedValue;

    return Object.fromEntries(
        Object.entries(localizedValue).map(([locale, value]) => {
            if (!Array.isArray(value)) return [locale, value];

            return [
                locale,
                value.filter(item => allowedEntryIds.has(item.sys?.id))
            ];
        })
    );
};

const hasDisallowedEntryLink = (value, allowedEntryIds) => {
    if (!value || typeof value !== 'object') return false;

    if (
        value.sys?.type === 'Link' &&
        value.sys.linkType === 'Entry' &&
        !allowedEntryIds.has(value.sys.id)
    ) {
        return true;
    }

    if (Array.isArray(value)) {
        return value.some(item => hasDisallowedEntryLink(item, allowedEntryIds));
    }

    return Object.values(value).some(item => hasDisallowedEntryLink(item, allowedEntryIds));
};

const sanitizeRichTextEntryLinks = (node, allowedEntryIds) => {
    if (!node || typeof node !== 'object') return node;

    if (
        node.nodeType === 'entry-hyperlink' &&
        hasDisallowedEntryLink(node.data?.target, allowedEntryIds)
    ) {
        return null;
    }

    if (node.nodeType === 'list-item' && hasDisallowedEntryLink(node, allowedEntryIds)) {
        return null;
    }

    if (Array.isArray(node)) {
        return node
            .map(item => sanitizeRichTextEntryLinks(item, allowedEntryIds))
            .filter(Boolean);
    }

    return Object.fromEntries(
        Object.entries(node)
            .map(([key, value]) => [key, sanitizeRichTextEntryLinks(value, allowedEntryIds)])
            .filter(([, value]) => value !== null)
    );
};

const filterLocalizedRichTextEntryLinks = (localizedValue, allowedEntryIds) => {
    if (!localizedValue) return localizedValue;

    return Object.fromEntries(
        Object.entries(localizedValue).map(([locale, value]) => [
            locale,
            sanitizeRichTextEntryLinks(value, allowedEntryIds)
        ])
    );
};

const sanitizeSampleEntries = (entries) => {
    const homeEntry = entries.find(entry => isPageBySlug(entry, 'home'));
    const notFoundEntry = entries.find(entry => isPageBySlug(entry, '404'));
    const privacyEntry = entries.find(entry => isPageBySlug(entry, 'privacy'));
    const homeContentBlockIds = [
        'homeOverviewContentBlock',
        'homeContentfulContentBlock',
        'homeChecksContentBlock',
        'homeReadmeContentBlock'
    ];
    const privacyContentBlockId = 'privacyContentBlock';
    const notFoundContentBlockId = 'notFoundContentBlock';
    const globalHeaderId = 'globalHeaderComponent';
    const globalFooterId = 'opHJQcbU3eli4wzDIBMAO';
    const footerLinksId = '2NCgZNsZw6dVOlLPpejlQB';
    const footerTrademarkId = '3A7t7lCQIkH1VRkfV03wzJ';
    const pageIds = new Set([homeEntry?.sys?.id, privacyEntry?.sys?.id].filter(Boolean));

    if (!homeEntry && !privacyEntry && !notFoundEntry) return [];

    if (homeEntry) {
        homeEntry.fields.pageComponents = filterLocalizedEntryLinks(
            homeEntry.fields.pageComponents,
            new Set([globalHeaderId, ...homeContentBlockIds, globalFooterId])
        );
    }

    if (privacyEntry) {
        privacyEntry.fields.pageComponents = filterLocalizedEntryLinks(
            privacyEntry.fields.pageComponents,
            new Set([globalHeaderId, privacyContentBlockId, globalFooterId])
        );
    }

    if (notFoundEntry) {
        notFoundEntry.fields.pageComponents = filterLocalizedEntryLinks(
            notFoundEntry.fields.pageComponents,
            new Set([globalHeaderId, notFoundContentBlockId, globalFooterId])
        );
    }

    entries.forEach((entry) => {
        if ([...homeContentBlockIds, privacyContentBlockId, notFoundContentBlockId].includes(entry.sys?.id)) {
            delete entry.fields.layout;
            delete entry.fields.assets;
            delete entry.fields.linkedEntries;
            delete entry.fields.link;
        }

        if (entry.sys?.id === globalHeaderId) {
            delete entry.fields.layout;
            delete entry.fields.content;
            delete entry.fields.linkedEntries;
            delete entry.fields.link;
        }

        if (entry.sys?.id === globalFooterId) {
            delete entry.fields.layout;
            entry.fields.linkedEntries = filterLocalizedEntryLinks(
                entry.fields.linkedEntries,
                new Set([footerLinksId, footerTrademarkId])
            );
        }

        if (entry.sys?.id === footerLinksId) {
            entry.fields.content = filterLocalizedRichTextEntryLinks(
                entry.fields.content,
                pageIds
            );
        }
    });

    return [homeEntry, privacyEntry, notFoundEntry].filter(Boolean);
};

const isFaviconAsset = (asset = {}) => {
    const titleValues = Object.values(asset.fields?.title || {});
    const fileValues = Object.values(asset.fields?.file || {});

    return titleValues.includes('favicon.ico') ||
        titleValues.includes('favicon') ||
        fileValues.some(file => file?.fileName === 'favicon.ico');
};

const pruneSkeletonContent = (filePath) => {
    const exportData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const previousEntryCount = exportData.entries?.length || 0;
    const previousAssetCount = exportData.assets?.length || 0;
    const entriesById = new Map((exportData.entries || []).map(entry => [entry.sys.id, entry]));
    const sampleEntries = sanitizeSampleEntries(exportData.entries || []);
    const entryIds = new Set();
    const assetIds = new Set();
    const queue = sampleEntries.map(entry => entry.sys.id);

    (exportData.assets || [])
        .filter(isFaviconAsset)
        .forEach(asset => assetIds.add(asset.sys.id));

    while (queue.length) {
        const entryId = queue.shift();

        if (entryIds.has(entryId)) continue;

        const entry = entriesById.get(entryId);

        if (!entry) continue;

        entryIds.add(entryId);

        const links = collectLinks(entry);

        links.assets.forEach(assetId => assetIds.add(assetId));
        links.entries.forEach((linkedEntryId) => {
            if (!entryIds.has(linkedEntryId)) queue.push(linkedEntryId);
        });
    }

    exportData.entries = (exportData.entries || []).filter(entry => entryIds.has(entry.sys?.id));
    exportData.assets = (exportData.assets || []).filter(asset => assetIds.has(asset.sys?.id));

    pruneDownloadedAssetFiles(exportData.assets);
    removeEmptyDirectories();
    validateDownloadedAssetFiles(exportData.assets);

    fs.writeFileSync(filePath, `${JSON.stringify(exportData, null, 2)}\n`);

    return {
        keptEntryCount: exportData.entries.length,
        keptAssetCount: exportData.assets.length,
        previousEntryCount,
        previousAssetCount
    };
};

const main = async () => {
    const {
        environmentId,
        managementToken,
        spaceId
    } = getContentfulConfig();

    fs.mkdirSync(outputDir, { recursive: true });
    cleanDownloadedAssets();

    await contentfulExport({
        contentFile,
        downloadAssets: true,
        environmentId,
        exportDir: outputDir,
        includeDrafts: true,
        managementToken,
        saveFile: true,
        skipContent: false,
        skipContentModel: false,
        skipContentPublishing: false,
        skipContentUpdates: false,
        skipRoles: true,
        skipWebhooks: true,
        spaceId,
        useVerboseRenderer: false
    });

    const outputPath = path.join(outputDir, contentFile);
    const {
        keptEntryCount,
        keptAssetCount,
        previousEntryCount,
        previousAssetCount
    } = pruneSkeletonContent(outputPath);

    debug.info(`Contentful skeleton export saved to ${outputPath}`);
    debug.info(`Pruned entries from ${previousEntryCount} to ${keptEntryCount}.`);
    debug.info(`Pruned assets from ${previousAssetCount} to ${keptAssetCount}.`);
};

main().catch((error) => {
    debug.error(error?.message || error);
    process.exitCode = 1;
});
