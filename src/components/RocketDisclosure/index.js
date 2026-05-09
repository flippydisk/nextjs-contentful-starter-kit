'use client';

import React, { useCallback, useMemo, useState, useSyncExternalStore } from 'react';

const storagePrefix = 'rocket-disclosure';
const storageEventName = 'rocket-disclosure-storage';

const readStoredOpenState = (storageKey, fallback) => {
    if (typeof window === 'undefined') return fallback;

    try {
        const storedValue = window.localStorage.getItem(storageKey);

        if (storedValue === null) return fallback;

        return storedValue === 'open';
    } catch {
        return fallback;
    }
};

const writeStoredOpenState = (storageKey, isOpen) => {
    if (typeof window === 'undefined') return;

    try {
        window.localStorage.setItem(storageKey, isOpen ? 'open' : 'closed');
        window.dispatchEvent(new CustomEvent(storageEventName, { detail: { storageKey } }));
    } catch {}
};

export default function RocketDisclosure({
    children,
    controlsId,
    defaultOpen = true,
    summary,
    summaryId
}) {
    const storageKey = useMemo(() => `${storagePrefix}:${summaryId || controlsId || summary}`, [controlsId, summary, summaryId]);
    const [isClosing, setIsClosing] = useState(false);
    const getSnapshot = useCallback(() => readStoredOpenState(storageKey, defaultOpen), [defaultOpen, storageKey]);
    const getServerSnapshot = useCallback(() => defaultOpen, [defaultOpen]);
    const subscribe = useCallback((callback) => {
        if (typeof window === 'undefined') return () => {};

        const handleStorageChange = (event) => {
            if (event.key && event.key !== storageKey) return;

            callback();
        };
        const handleLocalStorageChange = (event) => {
            if (event.detail?.storageKey !== storageKey) return;

            callback();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener(storageEventName, handleLocalStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener(storageEventName, handleLocalStorageChange);
        };
    }, [storageKey]);
    const isOpen = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const renderedOpen = isOpen || isClosing;

    const toggleDisclosure = (event) => {
        event.preventDefault();

        if (isOpen) {
            setIsClosing(true);
            writeStoredOpenState(storageKey, false);
            return;
        }

        setIsClosing(false);
        writeStoredOpenState(storageKey, true);
    };

    const finishClose = (event) => {
        if (event.target !== event.currentTarget || !isClosing) return;

        setIsClosing(false);
    };

    return (
        <details
            data-closing={isClosing ? 'true' : undefined}
            open={renderedOpen}
        >
            <summary
                aria-controls={controlsId}
                aria-expanded={isOpen}
                id={summaryId}
                onClick={toggleDisclosure}
            >
                {summary}
            </summary>
            <div
                className="rocket-details-panel"
                id={controlsId}
                onTransitionEnd={finishClose}
            >
                <div className="rocket-details-content">
                    {children}
                </div>
            </div>
        </details>
    );
}
