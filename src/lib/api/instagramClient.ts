export type InstagramProfile = {
    id?: string;
    username?: string;
    account_type?: string;
    media_count?: number;
    biography?: string | null; // not available via Basic Display
    profile_picture_url?: string | null; // not available via Basic Display
};

export type InstagramMediaItem = {
    id?: string;
    caption?: string | null;
    media_type?: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    media_url?: string;
    permalink?: string;
    thumbnail_url?: string | null;
    timestamp?: string;
    username?: string;
};

export type InstagramMediaResponse = {
    data?: InstagramMediaItem[];
};

const API_BASE = 'https://api.ibuuvai.me';

async function request<T>(path: string): Promise<T> {
    const r = await fetch(`${API_BASE}${path}`, { headers: { Accept: 'application/json' } });
    if (!r.ok) throw new Error(`Request failed: ${r.status}`);
    return (await r.json()) as T;
}

export const getInstagramProfile = () => request<InstagramProfile>('/ig/profile');
export const getInstagramMedia = (limit = 12) => request<InstagramMediaResponse>(`/ig/media?limit=${limit}`);


