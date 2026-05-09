describe('contentfulAPIUtils', () => {
    let mockContentfulClient;
    let deliveryClient;
    let previewClient;

    beforeEach(() => {
        jest.resetModules();

        deliveryClient = {
            getAssets: jest.fn(),
            getEntries: jest.fn()
        };
        previewClient = {
            getAssets: jest.fn(),
            getEntries: jest.fn()
        };
        mockContentfulClient = jest.fn((preview = false) => (preview ? previewClient : deliveryClient));

        jest.doMock('~/contentful/contentfulClient', () => ({
            __esModule: true,
            default: mockContentfulClient
        }));
    });

    afterEach(() => {
        jest.dontMock('~/contentful/contentfulClient');
    });

    const importUtils = async () => import('~/contentful/contentfulAPIUtils');

    it('fetches assets with tag filters and preview mode', async () => {
        previewClient.getAssets.mockResolvedValue({
            items: [{ sys: { id: 'asset-1' } }]
        });

        const {
            fetchAssets
        } = await importUtils();

        await expect(fetchAssets(['starter'], { preview: true })).resolves.toEqual([{ sys: { id: 'asset-1' } }]);
        expect(mockContentfulClient).toHaveBeenCalledWith(true);
        expect(previewClient.getAssets).toHaveBeenCalledWith({
            'metadata.tags.sys.id[in]': ['starter']
        });
    });

    it('returns empty asset collections when the client is missing or throws', async () => {
        mockContentfulClient.mockReturnValueOnce(null);

        const {
            fetchAssets
        } = await importUtils();

        await expect(fetchAssets()).resolves.toEqual([]);

        deliveryClient.getAssets.mockRejectedValueOnce(new Error('Contentful failed'));
        await expect(fetchAssets()).resolves.toEqual([]);
    });

    it('fetches single assets by title and file name', async () => {
        deliveryClient.getAssets
            .mockResolvedValueOnce({
                items: [{ fields: { title: 'Logo' } }]
            })
            .mockResolvedValueOnce({
                items: [{ fields: { file: { fileName: 'logo.png' } } }]
            });

        const {
            fetchAssetByFileName,
            fetchAssetByTitle
        } = await importUtils();

        await expect(fetchAssetByTitle('Logo')).resolves.toEqual({ fields: { title: 'Logo' } });
        expect(deliveryClient.getAssets).toHaveBeenNthCalledWith(1, {
            'fields.title': 'Logo',
            limit: 1
        });

        await expect(fetchAssetByFileName('logo.png')).resolves.toEqual({ fields: { file: { fileName: 'logo.png' } } });
        expect(deliveryClient.getAssets).toHaveBeenNthCalledWith(2, {
            'fields.file.fileName': 'logo.png',
            limit: 1
        });
    });

    it('returns empty objects for invalid single asset lookups', async () => {
        const {
            fetchAssetByFileName,
            fetchAssetByTitle
        } = await importUtils();

        await expect(fetchAssetByTitle()).resolves.toEqual({});
        await expect(fetchAssetByFileName()).resolves.toEqual({});

        deliveryClient.getAssets.mockRejectedValue(new Error('Contentful failed'));
        await expect(fetchAssetByTitle('Logo')).resolves.toEqual({});
        await expect(fetchAssetByFileName('logo.png')).resolves.toEqual({});
    });

    it('fetches pages and static params', async () => {
        deliveryClient.getEntries.mockResolvedValue({
            items: [
                { fields: { slug: 'home' } },
                { fields: { slug: 'privacy' } },
                { fields: {} }
            ]
        });

        const {
            fetchData,
            generateStaticParams
        } = await importUtils();

        await expect(fetchData()).resolves.toHaveLength(3);
        expect(deliveryClient.getEntries).toHaveBeenCalledWith({
            content_type: 'pages',
            include: 10
        });
        await expect(generateStaticParams()).resolves.toEqual([
            { slug: ['home'] },
            { slug: ['privacy'] },
            { slug: [] }
        ]);
    });

    it('returns empty page collections when entries cannot be fetched', async () => {
        deliveryClient.getEntries.mockRejectedValue(new Error('Contentful failed'));

        const {
            fetchData
        } = await importUtils();

        await expect(fetchData()).resolves.toEqual([]);
    });

    it('fetches a page by slug and rejects empty Contentful entries', async () => {
        deliveryClient.getEntries
            .mockResolvedValueOnce({
                items: [{ fields: { slug: 'privacy', title: 'Privacy' } }]
            })
            .mockResolvedValueOnce({
                items: [{}]
            });

        const {
            fetchDataBySlug
        } = await importUtils();

        await expect(fetchDataBySlug('privacy')).resolves.toEqual({ fields: { slug: 'privacy', title: 'Privacy' } });
        expect(deliveryClient.getEntries).toHaveBeenNthCalledWith(1, {
            content_type: 'pages',
            limit: 1,
            include: 10,
            'fields.slug': 'privacy'
        });
        await expect(fetchDataBySlug('missing')).resolves.toEqual({});
    });

    it('maps page content into metadata', async () => {
        deliveryClient.getEntries.mockResolvedValue({
            items: [
                {
                    fields: {
                        seo: {
                            fields: {
                                description: 'Privacy page'
                            }
                        },
                        slug: 'privacy',
                        thumbnail: {
                            fields: {
                                file: {
                                    url: '//images.ctfassets.net/privacy.png'
                                }
                            }
                        },
                        title: 'Privacy'
                    },
                    sys: {
                        updatedAt: '2026-05-08T00:00:00.000Z'
                    }
                }
            ]
        });

        const {
            getMetaDataFromContent
        } = await importUtils();

        await expect(getMetaDataFromContent('privacy')).resolves.toEqual({
            description: 'Privacy page',
            dataSlug: 'privacy',
            socialImg: '//images.ctfassets.net/privacy.png',
            title: 'Privacy',
            updatedAt: '2026-05-08T00:00:00.000Z'
        });
    });
});
