# Contentful Utilities

This folder contains small wrappers around the Contentful JavaScript SDK.

- `contentfulClient.js` creates a delivery client for production and a preview client for development.
- `contentfulAPIUtils.js` includes basic helpers for fetching assets, pages, page metadata, and static params.

The helpers expect these environment variables:

- `CONTENTFUL_ENV`
- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_CONTENT_DELIVERY_API_ACCESS_TOKEN`
- `CONTENTFUL_CONTENT_PREVIEW_API_ACCESS_TOKEN`
- `CONTENTFUL_PREVIEW_SECRET`

When credentials are not configured, the helpers return empty results so local builds can run before Contentful is connected.

To import the starter Contentful skeleton into your own space, also set:

- `CONTENTFUL_MIGRATION_TOKEN`

Create this as a Contentful CMA token at <https://app.contentful.com/account/profile/cma_tokens>, then use Contentful's **Authorize** action to authorize the token for the space in `CONTENTFUL_SPACE_ID`.

After the API keys are generated and saved in `.env.local`, run:

```bash
npm run contentful:import
```

This imports `contentful-skeleton/contentful-skeleton.json` and the downloaded media files under `contentful-skeleton/` into the configured `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ENV`.

## Live Preview

After the skeleton has been imported, configure Contentful Live Preview for the `Page` content type.

Use this preview URL in Contentful's **Settings** > **Content preview** area:

```text
https://localhost:3000/api/draft?secret=CONTENTFUL_PREVIEW_SECRET_VALUE&slug={entry.fields.slug}
```

Replace `CONTENTFUL_PREVIEW_SECRET_VALUE` with the value from `.env.local`. If you run the local dev server over HTTP, use `http://localhost:3000` instead.
