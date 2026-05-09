const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const isStaticExport = isGitHubPages || process.env.STATIC_EXPORT === 'true';
const basePath = isGitHubPages ? process.env.NEXT_PUBLIC_BASE_PATH || '' : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
    ...(isStaticExport ? {
        output: 'export',
        trailingSlash: true
    } : {}),
    ...(isGitHubPages ? {
        assetPrefix: basePath || undefined,
        basePath: basePath || undefined
    } : {}),
    distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
    reactStrictMode: true,
    turbopack: {},
    compiler: {
        styledComponents: false
    },
    images: {
        ...(isStaticExport ? { unoptimized: true } : {}),
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.ctfassets.net'
            }
        ]
    },
    ...(!isStaticExport ? {
        async headers() {
            return [
                {
                    source: '/:path*',
                    headers: [
                        {
                            key: 'Content-Security-Policy',
                            value: 'frame-ancestors \'self\' https://app.contentful.com https://app.eu.contentful.com'
                        }
                    ]
                },
                {
                    // matching API route
                    source: '/api/:path*',
                    headers: [
                        { key: 'Access-Control-Allow-Credentials', value: 'true' },
                        { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
                        { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' }
                    ]
                }
            ];
        }
    } : {})
};

export default nextConfig;
