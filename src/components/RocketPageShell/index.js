import Link from 'next/link';
import React from 'react';
import RocketDisclosure from '~/components/RocketDisclosure';
import StarterCredit from '~/components/StarterCredit';
import ThemeSwitcher from '~/components/ThemeSwitcher';

const defaultLogo = {
    alt: 'Next.js Starter Kit home',
    height: 74,
    src: '/themes/rocket/logo.png',
    width: 300
};

export const staticPageLinks = [
    { href: '/', label: 'Home' }
];

export const starterProjectLinks = [
    { href: 'https://nextjs.org/docs', label: 'Next.js Docs' },
    { href: 'https://www.contentful.com/developers/docs/', label: 'Contentful Docs' },
    { href: 'https://app.contentful.com/account/profile/cma_tokens', label: 'CMA Tokens' },
    { href: 'https://github.com/FiloSottile/mkcert#installation', label: 'mkcert Install' },
    { href: 'https://flippydisk.github.io/nextjs-contentful-starter-kit/', label: 'GitHub Pages Site' }
];

export const starterCommands = [
    'npm run dev',
    'npm run test',
    'npm run build',
    'npm run contentful:import'
];

export const footerLinks = [
    { href: '/', label: 'Home' },
    { href: '/privacy', label: 'Privacy' },
    { href: '/sitemap.xml', label: 'Sitemap' }
];

const renderLink = ({ href, label }) => {
    const isExternal = /^https?:\/\//.test(href);

    if (isExternal) {
        return (
            <a
                href={href}
                rel="noreferrer"
                target="_blank"
            >
                {label}
            </a>
        );
    }

    return <Link href={href}>{label}</Link>;
};

export const RocketDisclosureSection = ({
    children,
    id,
    sectionProps = {},
    summary
}) => {
    const headingId = `${id}-heading`;
    const panelId = `${id}-panel`;

    return (
        <section
            {...sectionProps}
            aria-labelledby={headingId}
        >
            <RocketDisclosure
                controlsId={panelId}
                summary={summary}
                summaryId={headingId}
            >
                {children}
            </RocketDisclosure>
        </section>
    );
};

export const RocketLogoHeader = ({
    linkLogo = true,
    logo = defaultLogo
}) => {
    const image = (
        <img
            alt={logo.alt || defaultLogo.alt}
            height={logo.height || defaultLogo.height}
            loading="eager"
            fetchPriority="high"
            src={logo.src || defaultLogo.src}
            title={logo.title}
            width={logo.width || defaultLogo.width}
        />
    );

    return (
        <header aria-label="Site header">
            <figure>
                {linkLogo ? <Link href="/">{image}</Link> : image}
                <figcaption aria-hidden="true" />
                <span className="sr-only">Rocket themed Next.js starter kit</span>
            </figure>
        </header>
    );
};

export const LinkList = ({
    ariaLabel,
    links = []
}) => {
    return (
        <nav aria-label={ariaLabel}>
            <ul>
                {links.map(link => (
                    <li key={`${link.href}:${link.label}`}>
                        {renderLink(link)}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export const CommandList = ({
    commands = []
}) => {
    return (
        <ul aria-label="Common npm commands">
            {commands.map(command => (
                <li key={command}>
                    <code>{command}</code>
                </li>
            ))}
        </ul>
    );
};

export const StaticFooter = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="rocket-readme rocket-contentful-footer" aria-label="Site footer">
            <nav aria-label="Footer links">
                <ul>
                    {footerLinks.map(link => (
                        <li key={`${link.href}:${link.label}`}>
                            <p>{renderLink(link)}</p>
                        </li>
                    ))}
                </ul>
            </nav>
            <p>Your Company 2000 - {year}. All rights reserved.</p>
        </footer>
    );
};

export const RocketPageMenu = ({
    commands = starterCommands,
    idPrefix,
    pageLinks = staticPageLinks,
    pageLinksLabel = 'Static pages',
    pageMenuId = `${idPrefix}-pages-menu`,
    projectLinks = starterProjectLinks
}) => {
    return (
        <menu aria-label="Page navigation">
            <li>
                <RocketDisclosureSection
                    id={`${idPrefix}-theme-menu`}
                    summary="Theme"
                >
                    <ThemeSwitcher />
                </RocketDisclosureSection>
            </li>
            <li>
                <RocketDisclosureSection
                    id={pageMenuId}
                    summary="Pages"
                >
                    <LinkList
                        ariaLabel={pageLinksLabel}
                        links={pageLinks}
                    />
                </RocketDisclosureSection>
            </li>
            <li>
                <RocketDisclosureSection
                    id={`${idPrefix}-links-menu`}
                    summary="Links"
                >
                    <LinkList
                        ariaLabel="Useful project links"
                        links={projectLinks}
                    />
                </RocketDisclosureSection>
            </li>
            <li>
                <RocketDisclosureSection
                    id={`${idPrefix}-commands-menu`}
                    summary="Commands"
                >
                    <CommandList commands={commands} />
                </RocketDisclosureSection>
            </li>
        </menu>
    );
};

export default function RocketPageShell({
    children,
    commands,
    idPrefix,
    linkLogo,
    logo,
    mainAriaLabel,
    pageLinks,
    pageLinksLabel,
    pageMenuId,
    projectLinks,
    showStaticFooter = true,
    showCredit = true
}) {
    return (
        <>
            <RocketLogoHeader
                linkLogo={linkLogo}
                logo={logo}
            />
            <div>
                <RocketPageMenu
                    commands={commands}
                    idPrefix={idPrefix}
                    pageLinks={pageLinks}
                    pageLinksLabel={pageLinksLabel}
                    pageMenuId={pageMenuId}
                    projectLinks={projectLinks}
                />
                <main aria-label={mainAriaLabel}>
                    {children}
                    {showStaticFooter ? (
                        <RocketDisclosureSection
                            id={`${idPrefix}-footer`}
                            summary="Footer"
                        >
                            <StaticFooter />
                        </RocketDisclosureSection>
                    ) : null}
                    {showCredit ? <StarterCredit /> : null}
                </main>
            </div>
        </>
    );
}
