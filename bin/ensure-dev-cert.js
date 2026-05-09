import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { Debug } from '@flippydisk/tools';

const rootDir = process.cwd();
const certDir = path.join(rootDir, 'certificates');
const certPath = path.join(certDir, 'localhost.pem');
const keyPath = path.join(certDir, 'localhost-key.pem');
const debug = new Debug({ control: 'EnsureDevCert', debug: false });

const run = (command, args) => {
    const result = spawnSync(command, args, {
        cwd: rootDir,
        stdio: 'inherit',
        shell: process.platform === 'win32'
    });

    if (result.error) {
        if (result.error.code === 'ENOENT') {
            debug.error('mkcert is required for trusted local HTTPS certificates.');
            debug.error('Install mkcert, then rerun `npm run dev` or `npm run generate:dev-cert`.');
        } else {
            debug.error(result.error.message);
        }

        process.exit(1);
    }

    if (result.status !== 0) {
        process.exit(result.status ?? 1);
    }
};

if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    process.exit(0);
}

fs.mkdirSync(certDir, { recursive: true });

run('mkcert', ['-install']);
run('mkcert', [
    '-cert-file',
    certPath,
    '-key-file',
    keyPath,
    'localhost',
    '127.0.0.1',
    '::1'
]);
