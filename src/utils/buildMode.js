export const isStaticExport = process.env.GITHUB_PAGES === 'true';

export const getDraftModeEnabled = async () => {
    if (isStaticExport) return false;

    const {
        draftMode
    } = await import('next/headers');
    const {
        isEnabled = false
    } = await draftMode();

    return isEnabled;
};
