import '@testing-library/jest-dom';
import React from 'react';

jest.mock('next/image', () => ({
    __esModule: true,
    default: ({
        alt = '',
        priority,
        unoptimized,
        ...props
    }) => React.createElement('img', {
        alt,
        ...props
    })
}));

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({
        children,
        href = '',
        prefetch,
        ...props
    }) => React.createElement('a', {
        href,
        ...props
    }, children)
}));
