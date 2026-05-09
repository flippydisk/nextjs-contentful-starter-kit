import React from 'react';

const stringifyJsonLd = (data = {}) => JSON.stringify(data).replace(/</gu, '\\u003c');

export default function JsonLdScript({
    data = {},
    id = undefined
} = {}) {
    return (
        <script
            dangerouslySetInnerHTML={{ __html: stringifyJsonLd(data) }}
            id={id}
            type="application/ld+json"
        />
    );
}
