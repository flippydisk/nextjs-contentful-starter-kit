# Next.js Starter Kit

Starter kit extracted from a production Next.js app without copying the full application surface. It includes Next.js, React, ESLint, SCSS, Tailwind, Jest, local HTTPS certificate generation, theme generation, and Contentful client helpers.

## Requirements

- Node.js `25` or newer, below `26`
- npm `11.11.0` or newer, below `12`
- `mkcert` for trusted local HTTPS certificates

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your local env file:

```bash
cp .env.example .env.local
```

3. Fill in `.env.local` with your own Contentful and site values. Never commit `.env.local`.

4. Install `mkcert` if you want trusted local HTTPS. The project uses `mkcert` to create certificates that browsers trust for `localhost`.

Windows options:

- Chocolatey: install Chocolatey from <https://chocolatey.org/install>, then run `choco install mkcert`.
- Scoop: install Scoop from <https://scoop.sh>, then run `scoop install mkcert`.
- Manual install: download the latest Windows binary from the mkcert releases page at <https://github.com/FiloSottile/mkcert/releases>, rename it to `mkcert.exe`, and place it somewhere on your `PATH`.

Check that Windows can find `mkcert`:

If you downloaded `mkcert.exe` manually and do not want to edit your system PATH yet, add its folder for the current terminal session.

PowerShell:

```powershell
where.exe mkcert // use the directory path this outputs in the $env:PATH below
$env:PATH = "C:\tools\mkcert;$env:PATH"
mkcert -version
```

Git Bash:

```bash
where mkcert
export PATH="/c/tools/mkcert:$PATH"
mkcert -version
```

macOS options:

- Homebrew: install Homebrew from <https://brew.sh>, then run `brew install mkcert`.
- MacPorts: run `sudo port install mkcert`.

Check that macOS can find `mkcert`:

```bash
which mkcert
mkcert -version
```

Homebrew and MacPorts usually add their binary folders to `PATH` during installation. If your shell cannot find `mkcert`, add the relevant folder for the current terminal session.

Apple Silicon Homebrew:

```bash
export PATH="/opt/homebrew/bin:$PATH"
mkcert -version
```

Intel Homebrew:

```bash
export PATH="/usr/local/bin:$PATH"
mkcert -version
```

MacPorts:

```bash
export PATH="/opt/local/bin:$PATH"
mkcert -version
```

The upstream mkcert installation notes are at <https://github.com/FiloSottile/mkcert#installation>. After installing `mkcert`, run:

```bash
npm run generate:dev-cert
```

This creates `certificates/localhost.pem` and `certificates/localhost-key.pem`. The `certificates/` folder is ignored by git.

## Development

Run the HTTPS dev server:

```bash
npm run dev
```

Use HTTP instead when certificate setup is not needed:

```bash
npm run dev:http
```

The dev scripts generate the Tailwind safelist and SCSS rocket theme before Next starts. The rocket theme also runs in watch mode during development.

## Build And Checks

Run lint and Jest:

```bash
npm run test
```

Run Jest only:

```bash
npm run jest
```

Run a production build:

```bash
npm run build
```

Run a static GitHub Pages build:

```bash
npm run build:github-pages
```

Clean local Next output:

```bash
npm run clean:dev
```

## GitHub Pages

This project includes `.github/workflows/github-pages.yml`, which builds the app as a static export and publishes the `out/` folder to GitHub Pages whenever `main` is pushed. You can also run it manually from the workflow dispatch button in GitHub Actions.

For this repository, the published GitHub Pages URL is expected to be <https://flippydisk.github.io/nextjs-contentful-starter-kit/>.

In GitHub, open the repository settings and set **Pages** > **Build and deployment** > **Source** to **GitHub Actions**.

Add these repository secrets under **Settings** > **Secrets and variables** > **Actions**:

- `CONTENTFUL_ENV`
- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_CONTENT_DELIVERY_API_ACCESS_TOKEN`

The workflow sets `NEXT_PUBLIC_BASE_PATH` to `/${{ github.event.repository.name }}` so project pages deploy correctly at `https://OWNER.github.io/REPOSITORY_NAME/`. If you deploy to a custom domain or an owner site such as `OWNER.github.io`, change `NEXT_PUBLIC_BASE_PATH` in `.github/workflows/github-pages.yml` to an empty string.

GitHub Pages is static hosting. Contentful content is fetched at build time, and Draft Mode, Live Preview, and `/api/draft` routes do not run on GitHub Pages.

## Contentful

Set these values in `.env.local`:

- `CONTENTFUL_ENV`: Contentful environment, usually `master`
- `CONTENTFUL_SPACE_ID`: Contentful space ID
- `CONTENTFUL_CONTENT_DELIVERY_API_ACCESS_TOKEN`: Content Delivery API access token
- `CONTENTFUL_CONTENT_PREVIEW_API_ACCESS_TOKEN`: Content Preview API access token for development previews
- `CONTENTFUL_MIGRATION_TOKEN`: Content Management API token used by the Contentful export/import scripts
- `CONTENTFUL_PREVIEW_SECRET`: URL-safe secret used to enable Next.js Draft Mode from Contentful preview URLs

Create the `CONTENTFUL_MIGRATION_TOKEN` separately from the space-level Delivery and Preview tokens. Go to <https://app.contentful.com/account/profile/cma_tokens>, choose **Generate personal token**, give it a name such as `NextJS Starter Kit Migration`, create the token, then copy the generated Content Management API token into `CONTENTFUL_MIGRATION_TOKEN`. Contentful only shows this token value once, so add it to `.env.local` before closing the page. After creating the token, use Contentful's **Authorize** action for that token and authorize it for the space you set in `CONTENTFUL_SPACE_ID`. Do not expose this token to the browser.

The starter includes `src/contentful/contentfulClient.js` and `src/contentful/contentfulAPIUtils.js`. They return empty results when credentials are missing, so the app can build before Contentful needs to be configured.

`npm run generate:safelist` reads Contentful `pages` entries and writes `src/themes/all/generated-safelist.css` from Tailwind class names it finds in content fields. If Contentful env vars are missing, it skips generation.

The starter also includes a reusable Contentful skeleton package at `contentful-skeleton/contentful-skeleton.json`. It contains the content model, editor interfaces, tags, locales, sample page entries, and the media files under `contentful-skeleton/` that are needed by those entries.

After the `.env.local` Contentful values are in place, import the starter skeleton into that Contentful space/environment:

```bash
npm run contentful:import
```

The import uses `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ENV`, and `CONTENTFUL_MIGRATION_TOKEN`. The migration token must be authorized for the target space before the import can create content types, tags, editor interfaces, entries, and uploaded media assets.

### Contentful Live Preview

The starter supports Contentful Live Preview through Next.js Draft Mode and `@contentful/live-preview`. This lets editors preview unpublished changes on localhost.

1. Add a strong URL-safe value to `.env.local`:

```bash
CONTENTFUL_PREVIEW_SECRET=make_this_a_long_url_safe_random_string
```

2. Run the trusted HTTPS dev server:

```bash
npm run dev
```

3. In Contentful, open your space and go to **Settings** > **Content preview**.

4. Create a preview platform, select the `Page` content type, and set the preview URL to:

```text
https://localhost:3000/api/draft?secret=CONTENTFUL_PREVIEW_SECRET_VALUE&slug={entry.fields.slug}
```

Replace `CONTENTFUL_PREVIEW_SECRET_VALUE` with the exact value from `.env.local`. If you are running `npm run dev:http`, use `http://localhost:3000` instead.

5. Save the preview platform, open a Page entry, and choose **Open Live Preview**. The app enables Draft Mode, redirects to the page with a `contentful_preview` marker, fetches from Contentful's Preview API, and initializes live updates and inspector mode inside the Contentful preview pane. The extra `contentful_preview` query param helps localhost previews keep working when browser iframe cookie rules prevent the Draft Mode cookie from being sent inside Contentful.

To leave Draft Mode locally, open:

```text
https://localhost:3000/api/draft/disable
```

To regenerate the skeleton from the configured source environment:

```bash
npm run contentful:export
```

This also downloads the included Contentful Media assets into `contentful-skeleton/` so `npm run contentful:import` can upload those local files into a new Contentful space instead of depending on the original media URLs.

Run `npm run contentful:export` only against the source Contentful space you want this starter kit to copy from. It overwrites the local `contentful-skeleton/contentful-skeleton.json` package.

## Theme Files

- `src/themes/all/tailwind.css`: Tailwind entrypoint
- `src/themes/all/fonts.scss`: global font and Font Awesome imports
- `src/themes/all/_tokens.scss`: shared SCSS tokens
- `src/themes/all/_mixins.scss`: shared SCSS mixins
- `src/themes/rocket/*.scss`: source files for the generated rocket theme
- `src/themes/atlas/*.scss`: source files for the generated atlas theme
- `src/themes/rocket/generated.scss`: generated output from `npm run generate:theme`
- `src/themes/atlas/generated.scss`: generated output from `npm run generate:theme`

Edit the source files under `src/themes/rocket/` and `src/themes/atlas/`; do not hand-edit generated SCSS files.

## Important Scripts

- `npm run dev`: HTTPS local dev with generated certificates
- `npm run dev:http`: HTTP local dev
- `npm run generate:dev-cert`: create local trusted certificates with mkcert
- `npm run generate:theme`: rebuild generated SCSS themes
- `npm run generate:safelist`: rebuild Tailwind source safelist from Contentful
- `npm run contentful:export`: export the reusable Contentful skeleton package plus included media assets
- `npm run contentful:import`: import `contentful-skeleton/contentful-skeleton.json` into the configured Contentful environment
- `npm run test`: ESLint plus Jest
- `npm run build`: production build
- `npm run build:github-pages`: static export for GitHub Pages

## Jest Coverage

Current `npm run jest:coverage` output:

```text
=============================== Coverage summary ===============================
Statements   : 100% ( 384/384 )
Branches     : 92.04% ( 81/88 )
Functions    : 100% ( 20/20 )
Lines        : 100% ( 384/384 )
================================================================================
------------------------|---------|----------|---------|---------|-------------------
File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------------|---------|----------|---------|---------|-------------------
All files               |     100 |    92.04 |     100 |     100 |
 contentful             |     100 |    91.48 |     100 |     100 |
  contentfulAPIUtils.js |     100 |    85.71 |     100 |     100 | 11,60,75-85
  contentfulClient.js   |     100 |      100 |     100 |     100 |
  previewUtils.js       |     100 |      100 |     100 |     100 |
 utils                  |     100 |    92.68 |     100 |     100 |
  buildMode.js          |     100 |      100 |     100 |     100 |
  hasContent.js         |     100 |      100 |     100 |     100 |
  structuredData.js     |     100 |    91.42 |     100 |     100 | 5,35,144
  themeConfig.js        |     100 |      100 |     100 |     100 |
------------------------|---------|----------|---------|---------|-------------------
```
