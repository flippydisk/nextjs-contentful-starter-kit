import hasContent from '~/utils/hasContent';

describe('hasContent', () => {
    it('detects objects with keys', () => {
        expect(hasContent({ title: 'Starter' })).toBe(true);
    });

    it('rejects empty objects and missing values', () => {
        expect(hasContent({})).toBe(false);
        expect(hasContent()).toBe(false);
    });
});
