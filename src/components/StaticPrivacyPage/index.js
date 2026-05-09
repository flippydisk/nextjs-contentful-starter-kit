import React from 'react';
import RocketPageShell, { RocketDisclosureSection } from '~/components/RocketPageShell';

export default function StaticPrivacyPage() {
    return (
        <RocketPageShell
            idPrefix="static-privacy"
            mainAriaLabel="Privacy policy"
        >
            <RocketDisclosureSection
                id="static-privacy"
                summary="Privacy Policy"
            >
                <article className="rocket-readme">
                    <h1>Privacy Policy</h1>
                    <p>
                        This static privacy page renders when Contentful is not configured or does not have a privacy page yet.
                    </p>
                    <p>
                        Import the starter Contentful skeleton or edit this static fallback to match your project&apos;s privacy requirements.
                    </p>
                </article>
            </RocketDisclosureSection>
        </RocketPageShell>
    );
}
