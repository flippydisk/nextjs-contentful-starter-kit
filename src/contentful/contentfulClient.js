import { createClient } from 'contentful';
import { CONTENTFUL_CONTENT_DELIVERY_API_ACCESS_TOKEN, CONTENTFUL_CONTENT_PREVIEW_API_ACCESS_TOKEN, CONTENTFUL_ENV, CONTENTFUL_SPACE_ID } from '~/state/env';

const hasDeliveryConfig = Boolean(CONTENTFUL_SPACE_ID && CONTENTFUL_ENV && CONTENTFUL_CONTENT_DELIVERY_API_ACCESS_TOKEN);
const hasPreviewConfig = Boolean(CONTENTFUL_SPACE_ID && CONTENTFUL_ENV && CONTENTFUL_CONTENT_PREVIEW_API_ACCESS_TOKEN);

// Published/Production
const client = hasDeliveryConfig ? createClient({
    space: CONTENTFUL_SPACE_ID,
    environment: CONTENTFUL_ENV,
    accessToken: CONTENTFUL_CONTENT_DELIVERY_API_ACCESS_TOKEN
}) : null;

// Preview/Development
const previewClient = hasPreviewConfig ? createClient({
    space: CONTENTFUL_SPACE_ID,
    environment: CONTENTFUL_ENV,
    accessToken: CONTENTFUL_CONTENT_PREVIEW_API_ACCESS_TOKEN,
    host: 'preview.contentful.com'
}) : null;

export default function contentfulClient(
    /**
     * Preview?: Boolean
     *
     * @default false
     */
    preview = false
) {
    if (preview && previewClient) return previewClient;

    return client;
}
