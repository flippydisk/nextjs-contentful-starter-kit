describe('preview utilities', () => {
    const {
        env: originalEnv
    } = process;

    afterEach(() => {
        jest.resetModules();
        process.env = originalEnv;
    });

    it('reads missing, scalar, array, and promised search params', async () => {
        const {
            getSearchParam
        } = await import('~/contentful/previewUtils');

        await expect(getSearchParam({}, 'missing')).resolves.toBe('');
        await expect(getSearchParam({ slug: 'home' }, 'slug')).resolves.toBe('home');
        await expect(getSearchParam({ slug: ['privacy', 'home'] }, 'slug')).resolves.toBe('privacy');
        await expect(getSearchParam(Promise.resolve({ slug: [''] }), 'slug')).resolves.toBe('');
    });

    it('accepts only the configured Contentful preview marker', async () => {
        jest.resetModules();
        process.env = {
            ...originalEnv,
            CONTENTFUL_PREVIEW_SECRET: 'preview-secret'
        };

        const {
            isContentfulPreviewRequest,
            previewSearchParam
        } = await import('~/contentful/previewUtils');

        await expect(isContentfulPreviewRequest({
            [previewSearchParam]: 'preview-secret'
        })).resolves.toBe(true);
        await expect(isContentfulPreviewRequest({
            [previewSearchParam]: 'wrong'
        })).resolves.toBe(false);
    });

    it('rejects preview markers when no secret is configured', async () => {
        jest.resetModules();
        process.env = {
            ...originalEnv,
            CONTENTFUL_PREVIEW_SECRET: ''
        };

        const {
            isContentfulPreviewRequest,
            previewSearchParam
        } = await import('~/contentful/previewUtils');

        await expect(isContentfulPreviewRequest({
            [previewSearchParam]: 'preview-secret'
        })).resolves.toBe(false);
    });
});
