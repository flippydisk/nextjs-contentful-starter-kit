export const themeStorageKey = 'starter-theme';

export const themes = [
    {
        label: 'Rocket',
        value: 'rocket'
    },
    {
        label: 'Atlas',
        value: 'atlas'
    }
];

export const themeInitScript = `(() => {
try {
const theme = window.localStorage.getItem('${themeStorageKey}');
if (${JSON.stringify(themes.map(({ value }) => value))}.includes(theme)) {
document.documentElement.dataset.theme = theme;
}
} catch {}
})();`;
