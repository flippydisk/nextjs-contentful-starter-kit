describe('buildMode', () => {
    const {
        env: originalEnv
    } = process;

    afterEach(() => {
        jest.resetModules();
        jest.dontMock('next/headers');
        process.env = originalEnv;
    });

    it('detects static export mode from GITHUB_PAGES', async () => {
        jest.resetModules();
        process.env = {
            ...originalEnv,
            GITHUB_PAGES: 'true'
        };

        const {
            isStaticExport
        } = await import('~/utils/buildMode');

        expect(isStaticExport).toBe(true);
    });

    it('does not import draftMode during static export builds', async () => {
        jest.resetModules();
        process.env = {
            ...originalEnv,
            GITHUB_PAGES: 'true'
        };

        const {
            getDraftModeEnabled
        } = await import('~/utils/buildMode');

        await expect(getDraftModeEnabled()).resolves.toBe(false);
    });

    it('reads enabled Draft Mode outside static export builds', async () => {
        jest.resetModules();
        process.env = {
            ...originalEnv,
            GITHUB_PAGES: ''
        };
        const draftMode = jest.fn().mockResolvedValue({
            isEnabled: true
        });

        jest.doMock('next/headers', () => ({
            draftMode
        }));

        const {
            getDraftModeEnabled,
            isStaticExport
        } = await import('~/utils/buildMode');

        expect(isStaticExport).toBe(false);
        await expect(getDraftModeEnabled()).resolves.toBe(true);
        expect(draftMode).toHaveBeenCalledTimes(1);
    });

    it('defaults Draft Mode to disabled when Next does not return isEnabled', async () => {
        jest.resetModules();
        process.env = {
            ...originalEnv,
            GITHUB_PAGES: ''
        };
        const draftMode = jest.fn().mockResolvedValue({});

        jest.doMock('next/headers', () => ({
            draftMode
        }));

        const {
            getDraftModeEnabled
        } = await import('~/utils/buildMode');

        await expect(getDraftModeEnabled()).resolves.toBe(false);
    });
});
