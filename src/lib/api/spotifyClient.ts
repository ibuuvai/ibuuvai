export type NowPlaying = {
	is_playing?: boolean;
	progress_ms?: number;
	item?: {
		id?: string;
		name?: string;
		duration_ms?: number;
		artists?: { name?: string }[];
		album?: { images?: { url: string }[] };
		external_urls?: { spotify?: string };
	} | null;
};

export type RecentlyPlayed = {
	items?: {
		played_at?: string;
		track: {
			id?: string;
			name?: string;
			artists?: { name?: string }[];
			album?: { images?: { url: string }[] };
		};
	}[];
};

export type TopTracks = {
	items?: {
		id?: string;
		name?: string;
		artists?: { name?: string }[];
		album?: { images?: { url: string }[] };
	}[];
};

const API_BASE = 'https://api.ibuuvai.me';

async function request<T>(path: string): Promise<T> {
	const r = await fetch(`${API_BASE}${path}`, { headers: { Accept: 'application/json' } });
	if (!r.ok) throw new Error(`Request failed: ${r.status}`);
	return (await r.json()) as T;
}

export const getNowPlaying = () => request<NowPlaying>('/now');
export const getRecentlyPlayed = (limit = 10) => request<RecentlyPlayed>(`/recent?limit=${limit}`);
export const getTopTracks = (
	timeRange: 'short_term' | 'medium_term' | 'long_term' = 'short_term',
	limit = 10
) => request<TopTracks>(`/top?time_range=${timeRange}&limit=${limit}`);
