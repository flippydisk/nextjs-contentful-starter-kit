'use client';

import { ContentfulLivePreviewProvider } from '@contentful/live-preview/react';
import React from 'react';

export default function ContentfulLivePreview({
    children,
    enabled = false,
    environment = '',
    space = ''
}) {
    return (
        <ContentfulLivePreviewProvider
            locale="en-US"
            space={space}
            environment={environment}
            enableInspectorMode={enabled}
            enableLiveUpdates={enabled}
            targetOrigin={[
                'https://app.contentful.com',
                'https://app.eu.contentful.com'
            ]}
        >
            {children}
        </ContentfulLivePreviewProvider>
    );
}
