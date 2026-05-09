import fs from 'node:fs';
import path from 'node:path';

export const rootDir = process.cwd();

const parseEnvFile = (filePath) => {
    const contents = fs.readFileSync(filePath, 'utf8');
    const env = {};

    contents.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith('#')) return;

        const separatorIndex = trimmed.indexOf('=');

        if (separatorIndex === -1) return;

        const key = trimmed.slice(0, separatorIndex).trim();
        let value = trimmed.slice(separatorIndex + 1).trim();

        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith('\'') && value.endsWith('\''))
        ) {
            value = value.slice(1, -1);
        }

        env[key] = value;
    });

    return env;
};

export const loadContentfulEnv = () => {
    const envPath = [
        path.join(rootDir, '.env.local'),
        path.join(rootDir, '.env')
    ].find(filePath => fs.existsSync(filePath));

    if (!envPath) {
        throw new Error('Missing .env.local or .env file.');
    }

    return {
        env: parseEnvFile(envPath),
        envPath
    };
};

export const getContentfulConfig = () => {
    const {
        env,
        envPath
    } = loadContentfulEnv();
    const {
        CONTENTFUL_ENV: environmentId,
        CONTENTFUL_MIGRATION_TOKEN: managementToken,
        CONTENTFUL_SPACE_ID: spaceId
    } = env;
    const missing = Object.entries({
        CONTENTFUL_ENV: environmentId,
        CONTENTFUL_MIGRATION_TOKEN: managementToken,
        CONTENTFUL_SPACE_ID: spaceId
    }).filter(([, value]) => !value).map(([key]) => key);

    if (missing.length) {
        throw new Error(`Missing required Contentful env values in ${envPath}: ${missing.join(', ')}`);
    }

    return {
        environmentId,
        managementToken,
        spaceId
    };
};
