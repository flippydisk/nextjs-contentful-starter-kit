describe('publicPath', () => {
    const {
        env: originalEnv
    } = process;

    afterEach(() => {
        jest.resetModules();
        process.env = originalEnv;
    });

    it('prefixes root-relative URLs with the public base path', async () => {
        jest.resetModules();
        process.env = {
            ...originalEnv,
            NEXT_PUBLIC_BASE_PATH: '/nextjs-contentful-starter-kit'
        };

        const {
            withPublicBasePath
        } = await import('~/utils/publicPath');

        expect(withPublicBasePath('/')).toBe('/nextjs-contentful-starter-kit/');
        expect(withPublicBasePath('/sitemap.xml')).toBe('/nextjs-contentful-starter-kit/sitemap.xml');
        expect(withPublicBasePath('/privacy')).toBe('/nextjs-contentful-starter-kit/privacy');
    });

    it('leaves external and already-prefixed URLs unchanged', async () => {
        jest.resetModules();
        process.env = {
            ...originalEnv,
            NEXT_PUBLIC_BASE_PATH: '/nextjs-contentful-starter-kit'
        };

        const {
            withPublicBasePath
        } = await import('~/utils/publicPath');

        expect(withPublicBasePath('https://example.com/sitemap.xml')).toBe('https://example.com/sitemap.xml');
        expect(withPublicBasePath('//example.com/sitemap.xml')).toBe('//example.com/sitemap.xml');
        expect(withPublicBasePath('/nextjs-contentful-starter-kit/sitemap.xml')).toBe('/nextjs-contentful-starter-kit/sitemap.xml');
    });

    it('leaves root-relative URLs unchanged without a base path', async () => {
        jest.resetModules();
        process.env = {
            ...originalEnv,
            NEXT_PUBLIC_BASE_PATH: ''
        };

        const {
            withPublicBasePath
        } = await import('~/utils/publicPath');

        expect(withPublicBasePath('/sitemap.xml')).toBe('/sitemap.xml');
    });
});
