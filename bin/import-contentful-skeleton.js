import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { Debug } from '@flippydisk/tools';
import { getContentfulConfig, rootDir } from './contentful-env.js';
const require = createRequire(import.meta.url);
const contentfulImport = require('contentful-import');
const contentFile = path.join(rootDir, 'contentful-skeleton', 'contentful-skeleton.json');
const assetsDirectory = path.join(rootDir, 'contentful-skeleton');
const preparedAssetsDirectory = path.join(rootDir, 'contentful-skeleton', '.import-assets');
const debug = new Debug({ control: 'ImportContentfulSkeleton', debug: false });

const normalizeAssetUrl = (url = '') => {
    if (!url) return '';
    if (url.startsWith('//')) return `https:${url}`;

    return url;
};

const walkFiles = (dir) => {
    if (!fs.existsSync(dir)) return [];

    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = path.join(dir, entry.name);

        if (fullPath.startsWith(preparedAssetsDirectory)) return [];
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

const prepareImportAssets = () => {
    const data = JSON.parse(fs.readFileSync(contentFile, 'utf8'));
    const files = walkFiles(assetsDirectory);

    fs.rmSync(preparedAssetsDirectory, {
        force: true,
        recursive: true
    });

    for (const asset of data.assets || []) {
        const assetId = asset?.sys?.id || '';

        for (const file of Object.values(asset?.fields?.file || {})) {
            const url = file?.url || file?.upload || '';
            const targetPath = getLocalAssetPath(preparedAssetsDirectory, url);

            if (!targetPath) continue;

            const sourcePath = files.find(candidate => (
                candidate.includes(assetId) &&
                path.basename(candidate) === file.fileName
            ));

            if (!sourcePath) {
                throw new Error(`Missing local asset file for ${assetId}/${file.fileName}. Run npm run contentful:export first.`);
            }

            fs.mkdirSync(path.dirname(targetPath), { recursive: true });
            fs.copyFileSync(sourcePath, targetPath);
        }
    }
};

const main = async () => {
    const {
        environmentId,
        managementToken,
        spaceId
    } = getContentfulConfig();

    prepareImportAssets();

    await contentfulImport({
        assetsDirectory: preparedAssetsDirectory,
        contentFile,
        environmentId,
        managementToken,
        skipContentPublishing: false,
        spaceId,
        uploadAssets: true
    });

    debug.info(`Contentful skeleton imported from ${contentFile}`);
};

main().catch((error) => {
    debug.error(error?.message || error);
    process.exitCode = 1;
});
