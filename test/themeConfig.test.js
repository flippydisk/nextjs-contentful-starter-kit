import {
    themeInitScript,
    themes,
    themeStorageKey
} from '~/utils/themeConfig';

describe('themeConfig', () => {
    it('defines the supported themes and storage key', () => {
        expect(themeStorageKey).toBe('starter-theme');
        expect(themes).toEqual([
            {
                label: 'Rocket',
                value: 'rocket'
            },
            {
                label: 'Atlas',
                value: 'atlas'
            }
        ]);
    });

    it('initializes the document theme from localStorage when the stored theme is supported', () => {
        window.localStorage.setItem(themeStorageKey, 'atlas');
        delete document.documentElement.dataset.theme;

        Function(themeInitScript)();

        expect(document.documentElement.dataset.theme).toBe('atlas');
    });

    it('ignores unsupported stored theme values', () => {
        window.localStorage.setItem(themeStorageKey, 'unknown');
        delete document.documentElement.dataset.theme;

        Function(themeInitScript)();

        expect(document.documentElement.dataset.theme).toBeUndefined();
    });
});
