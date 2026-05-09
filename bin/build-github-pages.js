import { execFileSync } from 'node:child_process';
import { existsSync, renameSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const apiDir = join(rootDir, 'src', 'app', 'api');
const disabledApiDir = join(rootDir, 'src', '.api-disabled-for-github-pages');
const nextBin = join(rootDir, 'node_modules', 'next', 'dist', 'bin', 'next');

let movedApiRoutes = false;

const restoreApiRoutes = () => {
    if (movedApiRoutes && existsSync(disabledApiDir)) {
        renameSync(disabledApiDir, apiDir);
    }
};

try {
    process.env.GITHUB_PAGES = 'true';
    process.env.NODE_ENV = 'production';

    if (existsSync(apiDir)) {
        if (existsSync(disabledApiDir)) {
            throw new Error(`Cannot disable API routes because ${disabledApiDir} already exists.`);
        }

        renameSync(apiDir, disabledApiDir);
        movedApiRoutes = true;
    }

    execFileSync(process.execPath, [nextBin, 'build', '--webpack'], {
        cwd: rootDir,
        env: process.env,
        stdio: 'inherit'
    });
} finally {
    restoreApiRoutes();
}
