import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { previewSearchParam } from '~/contentful/previewUtils';
import { CONTENTFUL_PREVIEW_SECRET } from '~/state/env';

const getPathFromSlug = (slug = '') => {
    const path = !slug || slug === 'home' ? '/' : `/${slug.replace(/^\/+/, '')}`;
    const params = new URLSearchParams({
        [previewSearchParam]: CONTENTFUL_PREVIEW_SECRET
    });

    return `${path}?${params.toString()}`;
};

export const GET = async (request) => {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret') || '';
    const slug = searchParams.get('slug') || 'home';

    if (!CONTENTFUL_PREVIEW_SECRET || secret !== CONTENTFUL_PREVIEW_SECRET) {
        return new Response('Invalid preview secret.', { status: 401 });
    }

    const draft = await draftMode();
    draft.enable();

    return redirect(getPathFromSlug(slug));
};
