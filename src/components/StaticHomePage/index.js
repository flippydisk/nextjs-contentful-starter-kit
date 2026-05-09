import React from 'react';
import RocketPageShell, { RocketDisclosureSection } from '~/components/RocketPageShell';
import { NEXT_PUBLIC_SITE_URL } from '~/state/env';

export default function StaticHomePage() {
    return (
        <RocketPageShell
            idPrefix="static"
            linkLogo={false}
            mainAriaLabel="Starter kit overview"
        >
            <RocketDisclosureSection
                id="static-overview"
                summary="Next.js starter kit"
            >
                <article className="rocket-readme">
                    <h1>Welcome to the Flippydisk NextJS + Contentful starter kit</h1>
                    <p>
                                    The starter includes Next.js, Tailwind, SCSS, Jest, local HTTPS certificate generation, and Contentful utilities.
                                    It&apos;s also theme-able, where Rocket theme is the default layout but you can change it to Atlas on the
                                    left hand menu, giving you the ability to add different layouts to your site while reusing 99% of the same
                                    code and CMS content.
                    </p>
                    <p>
                                    Local URL: <strong>{NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'}</strong>
                    </p>
                    <p>
                                    GitHub Pages URL:{' '}
                        <a href="https://flippydisk.github.io/nextjs-contentful-starter-kit/" rel="noreferrer" target="_blank">
                                        https://flippydisk.github.io/nextjs-contentful-starter-kit/
                        </a>
                    </p>
                </article>
            </RocketDisclosureSection>
            <RocketDisclosureSection
                id="static-contentful"
                summary="Contentful"
            >
                <article className="rocket-readme">
                    <h1>Contentful needs to be configured</h1>
                    <p>
                                    This static fallback renders when the Contentful environment variables are missing, incorrect, or the <code>contentful-skeleton.json</code> has not been imported into Contentful yet.
                    </p>
                    <p>
                                    This, of course, is optional. You could continue to edit <code>src/components/StaticHomePage</code> and just stick with that.
                                    If you want to unlock the power of authoring without code changes, follow the steps in the README to setup Contentful.
                    </p>
                    <h3>Create a Contentful account</h3>
                    <ol>
                        <li>
                                        Go to <a href="https://www.contentful.com/sign-up/" rel="noreferrer" target="_blank">Contentful sign up</a> and create an account.
                                        The free plan is enough for this kit to import all included components; any paid plan above the free tier will also work.
                        </li>
                        <li>
                                        Create a space for this project. Contentful spaces contain your content model, entries, assets, environments, and API keys.
                        </li>
                        <li>
                                        Use the default <code>master</code> environment or create another environment in the Contentful web app if your team separates staging and production content.
                        </li>
                    </ol>
                    <h3>Create the API keys</h3>
                    <ol>
                        <li>
                                        In the Contentful web app, open your space, then go to <strong>Settings</strong> and <strong>API keys</strong>.
                        </li>
                        <li>
                                        Create or open a Content delivery / preview token. Contentful exposes the space ID, Content Delivery API token, and Content Preview API token from this area.
                        </li>
                        <li>
                                        Copy the space ID into <code>CONTENTFUL_SPACE_ID</code>.
                        </li>
                        <li>
                                        Copy the Content Delivery API access token into <code>CONTENTFUL_CONTENT_DELIVERY_API_ACCESS_TOKEN</code>.
                        </li>
                        <li>
                                        Copy the Content Preview API access token into <code>CONTENTFUL_CONTENT_PREVIEW_API_ACCESS_TOKEN</code>.
                        </li>
                        <li>
                                        Add a long URL-safe value to <code>CONTENTFUL_PREVIEW_SECRET</code>. This secret is used by the
                                        Contentful Live Preview URL to enable Next.js Draft Mode.
                        </li>
                        <li>
                                        Go to{' '}
                            <a href="https://app.contentful.com/account/profile/cma_tokens" rel="noreferrer" target="_blank">Contentful CMA tokens</a>
                                        , choose <strong>Generate personal token</strong>, name it for this project, create the token, and put it in{' '}
                            <code>CONTENTFUL_MIGRATION_TOKEN</code>
                                        . Use Contentful&apos;s <strong>Authorize</strong> action for the token and authorize it for the space in{' '}
                            <code>CONTENTFUL_SPACE_ID</code>
                                        .
                        </li>
                    </ol>
                    <h3>Update .env.local</h3>
                    <pre>
                        <code>{`CONTENTFUL_ENV=master
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_CONTENT_DELIVERY_API_ACCESS_TOKEN=your_content_delivery_api_access_token
CONTENTFUL_CONTENT_PREVIEW_API_ACCESS_TOKEN=your_content_preview_api_access_token
CONTENTFUL_MIGRATION_TOKEN=your_content_management_api_token
CONTENTFUL_PREVIEW_SECRET=make_this_a_long_url_safe_random_string`}</code>
                    </pre>
                    <h3>Import the starter skeleton</h3>
                    <p>
                                    After the API keys are generated and saved in <code>.env.local</code>, import the bundled skeleton into that Contentful space and environment.
                    </p>
                    <pre>
                        <code>npm run contentful:import</code>
                    </pre>
                    <h3>Enable Live Preview</h3>
                    <p>
                                    In Contentful, go to <strong>Settings</strong> and <strong>Content preview</strong>. Create a preview
                                    platform for the Page content type with this URL:
                    </p>
                    <pre>
                        <code>
                                        https://localhost:3000/api/draft?secret=CONTENTFUL_PREVIEW_SECRET_VALUE&amp;slug={'{entry.fields.slug}'}
                        </code>
                    </pre>
                    <p>
                                    Replace <code>CONTENTFUL_PREVIEW_SECRET_VALUE</code> with the exact value from <code>.env.local</code>.
                                    Then run <code>npm run dev</code>, open a Page entry, and choose <strong>Open Live Preview</strong>.
                    </p>
                </article>
            </RocketDisclosureSection>
            <RocketDisclosureSection
                id="static-checks"
                summary="Checks"
            >
                <article className="rocket-readme">
                    <h2>Run tests and builds before shipping</h2>
                    <ul>
                        <li><code>npm run test</code></li>
                        <li><code>npm run build</code></li>
                        <li><code>npm run generate:theme</code></li>
                    </ul>
                </article>
            </RocketDisclosureSection>
            <RocketDisclosureSection
                id="static-coverage"
                summary="Jest Coverage"
            >
                <article className="rocket-readme">
                    <h2>Current npm run jest:coverage output</h2>
                    <pre>
                        <code>{`=============================== Coverage summary ===============================
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
------------------------|---------|----------|---------|---------|-------------------`}</code>
                    </pre>
                </article>
            </RocketDisclosureSection>
        </RocketPageShell>
    );
}
