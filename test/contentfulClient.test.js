describe('contentfulClient', () => {
    const {
        env: originalEnv
    } = process;

    beforeEach(() => {
        jest.resetModules();
        process.env = {
            ...originalEnv,
            CONTENTFUL_CONTENT_DELIVERY_API_ACCESS_TOKEN: '',
            CONTENTFUL_CONTENT_PREVIEW_API_ACCESS_TOKEN: '',
            CONTENTFUL_ENV: '',
            CONTENTFUL_SPACE_ID: ''
        };
    });

    afterEach(() => {
        jest.dontMock('contentful');
        process.env = originalEnv;
    });

    it('returns null when Contentful environment variables are not configured', async () => {
        const {
            default: contentfulClient
        } = await import('~/contentful/contentfulClient');

        expect(contentfulClient()).toBeNull();
        expect(contentfulClient(true)).toBeNull();
    });

    it('creates and returns the delivery client when delivery credentials are configured', async () => {
        const deliveryClient = {
            type: 'delivery'
        };
        const createClient = jest.fn().mockReturnValue(deliveryClient);

        jest.doMock('contentful', () => ({
            createClient
        }));
        process.env = {
            ...process.env,
            CONTENTFUL_CONTENT_DELIVERY_API_ACCESS_TOKEN: 'delivery-token',
            CONTENTFUL_CONTENT_PREVIEW_API_ACCESS_TOKEN: '',
            CONTENTFUL_ENV: 'master',
            CONTENTFUL_SPACE_ID: 'space-id'
        };

        const {
            default: contentfulClient
        } = await import('~/contentful/contentfulClient');

        expect(createClient).toHaveBeenCalledTimes(1);
        expect(createClient).toHaveBeenCalledWith({
            space: 'space-id',
            environment: 'master',
            accessToken: 'delivery-token'
        });
        expect(contentfulClient()).toBe(deliveryClient);
        expect(contentfulClient(true)).toBe(deliveryClient);
    });

    it('creates and returns the preview client when preview credentials are configured', async () => {
        const deliveryClient = {
            type: 'delivery'
        };
        const previewClient = {
            type: 'preview'
        };
        const createClient = jest.fn()
            .mockReturnValueOnce(deliveryClient)
            .mockReturnValueOnce(previewClient);

        jest.doMock('contentful', () => ({
            createClient
        }));
        process.env = {
            ...process.env,
            CONTENTFUL_CONTENT_DELIVERY_API_ACCESS_TOKEN: 'delivery-token',
            CONTENTFUL_CONTENT_PREVIEW_API_ACCESS_TOKEN: 'preview-token',
            CONTENTFUL_ENV: 'master',
            CONTENTFUL_SPACE_ID: 'space-id'
        };

        const {
            default: contentfulClient
        } = await import('~/contentful/contentfulClient');

        expect(createClient).toHaveBeenCalledTimes(2);
        expect(createClient).toHaveBeenNthCalledWith(1, {
            space: 'space-id',
            environment: 'master',
            accessToken: 'delivery-token'
        });
        expect(createClient).toHaveBeenNthCalledWith(2, {
            space: 'space-id',
            environment: 'master',
            accessToken: 'preview-token',
            host: 'preview.contentful.com'
        });
        expect(contentfulClient()).toBe(deliveryClient);
        expect(contentfulClient(true)).toBe(previewClient);
    });
});
