import Link from 'next/link';
import React from 'react';
import RocketPageShell, { RocketDisclosureSection, starterProjectLinks } from '~/components/RocketPageShell';

const notFoundProjectLinks = starterProjectLinks.slice(0, 2);
const notFoundCommands = [
    'npm run dev',
    'npm run contentful:import'
];

export default function StaticNotFoundPage() {
    return (
        <RocketPageShell
            commands={notFoundCommands}
            idPrefix="static-404"
            mainAriaLabel="Page not found"
            projectLinks={notFoundProjectLinks}
        >
            <RocketDisclosureSection
                id="static-404"
                summary="Page Not Found"
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
            </RocketDisclosureSection>
        </RocketPageShell>
    );
}
