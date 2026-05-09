import Link from 'next/link';
import React from 'react';
import RocketDisclosure from '~/components/RocketDisclosure';
import StarterCredit from '~/components/StarterCredit';
import ThemeSwitcher from '~/components/ThemeSwitcher';

export default function StaticNotFoundPage() {
    return (
        <>
            <header aria-label="Site header">
                <figure>
                    <Link href="/">
                        <img
                            alt="Next.js Starter Kit home"
                            height="74"
                            loading="eager"
                            fetchPriority="high"
                            src="/themes/rocket/logo.png"
                            width="300"
                        />
                    </Link>
                    <figcaption aria-hidden="true" />
                    <span className="sr-only">Rocket themed Next.js starter kit</span>
                </figure>
            </header>
            <div>
                <menu aria-label="Page navigation">
                    <li>
                        <section aria-labelledby="static-404-theme-menu-heading">
                            <RocketDisclosure
                                controlsId="static-404-theme-menu-panel"
                                summary="Theme"
                                summaryId="static-404-theme-menu-heading"
                            >
                                <ThemeSwitcher />
                            </RocketDisclosure>
                        </section>
                    </li>
                    <li>
                        <section aria-labelledby="static-404-pages-menu-heading">
                            <RocketDisclosure
                                controlsId="static-404-pages-menu-panel"
                                summary="Pages"
                                summaryId="static-404-pages-menu-heading"
                            >
                                <nav aria-label="Static pages">
                                    <ul>
                                        <li><Link href="/">Home</Link></li>
                                    </ul>
                                </nav>
                            </RocketDisclosure>
                        </section>
                    </li>
                    <li>
                        <section aria-labelledby="static-404-links-menu-heading">
                            <RocketDisclosure
                                controlsId="static-404-links-menu-panel"
                                summary="Links"
                                summaryId="static-404-links-menu-heading"
                            >
                                <nav aria-label="Useful project links">
                                    <ul>
                                        <li><a href="https://nextjs.org/docs" rel="noreferrer" target="_blank">Next.js Docs</a></li>
                                        <li><a href="https://www.contentful.com/developers/docs/" rel="noreferrer" target="_blank">Contentful Docs</a></li>
                                    </ul>
                                </nav>
                            </RocketDisclosure>
                        </section>
                    </li>
                    <li>
                        <section aria-labelledby="static-404-commands-menu-heading">
                            <RocketDisclosure
                                controlsId="static-404-commands-menu-panel"
                                summary="Commands"
                                summaryId="static-404-commands-menu-heading"
                            >
                                <ul aria-label="Common npm commands">
                                    <li><code>npm run dev</code></li>
                                    <li><code>npm run contentful:import</code></li>
                                </ul>
                            </RocketDisclosure>
                        </section>
                    </li>
                </menu>
                <main aria-label="Page not found">
                    <section aria-labelledby="static-404-heading">
                        <RocketDisclosure
                            controlsId="static-404-panel"
                            summary="Page Not Found"
                            summaryId="static-404-heading"
                        >
                            <article className="rocket-readme">
                                <h1>Page not found.</h1>
                                <p>
                                    The page you requested does not exist, and Contentful is not configured with a 404 page yet.
                                </p>
                                <p>
                                    Return to <Link href="/">Home</Link> or import the starter Contentful skeleton.
                                </p>
                                <pre>
                                    <code>npm run contentful:import</code>
                                </pre>
                            </article>
                        </RocketDisclosure>
                    </section>
                    <StarterCredit />
                </main>
            </div>
        </>
    );
}
