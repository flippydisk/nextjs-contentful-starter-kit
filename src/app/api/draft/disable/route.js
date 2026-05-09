import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export const GET = async (request) => {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug') || 'home';
    const draft = await draftMode();

    draft.disable();

    return redirect(slug && slug !== 'home' ? `/${slug.replace(/^\/+/, '')}` : '/');
};
