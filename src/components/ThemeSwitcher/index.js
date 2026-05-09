'use client';

import React, { useCallback, useEffect, useSyncExternalStore } from 'react';
import { themes, themeStorageKey } from '~/utils/themeConfig';

const themeEventName = 'starter-theme-change';

const isSupportedTheme = theme => themes.some(({ value }) => value === theme);

const readTheme = () => {
    if (typeof window === 'undefined') return 'rocket';

    try {
        const storedTheme = window.localStorage.getItem(themeStorageKey);

        return isSupportedTheme(storedTheme) ? storedTheme : 'rocket';
    } catch {
        return 'rocket';
    }
};

const writeTheme = (theme) => {
    if (typeof window === 'undefined' || !isSupportedTheme(theme)) return;

    try {
        window.localStorage.setItem(themeStorageKey, theme);
    } catch {}

    window.document.documentElement.dataset.theme = theme;
    window.dispatchEvent(new CustomEvent(themeEventName, { detail: { theme } }));
};

export default function ThemeSwitcher() {
    const subscribe = useCallback((callback) => {
        if (typeof window === 'undefined') return () => {};

        const handleStorage = (event) => {
            if (event.key && event.key !== themeStorageKey) return;

            callback();
        };

        window.addEventListener('storage', handleStorage);
        window.addEventListener(themeEventName, callback);

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener(themeEventName, callback);
        };
    }, []);
    const selectedTheme = useSyncExternalStore(subscribe, readTheme, () => 'rocket');

    useEffect(() => {
        document.documentElement.dataset.theme = selectedTheme;
    }, [selectedTheme]);

    return (
        <div className="theme-switcher" role="group" aria-label="Theme selection">
            {themes.map(({ label, value }) => (
                <button
                    aria-label={`Use ${label} theme`}
                    aria-pressed={selectedTheme === value}
                    key={value}
                    onClick={() => writeTheme(value)}
                    type="button"
                >
                    {label}
                </button>
            ))}
        </div>
    );
}
