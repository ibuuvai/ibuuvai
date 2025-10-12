export type IgProfile = {
  id?: string;
  user_id?: string;
  username?: string;
  name?: string;
  account_type?: string;
  profile_picture_url?: string;
  followers_count?: number;
  follows_count?: number;
  media_count?: number;
  bio?: string;
} | null;

export type IgMedia = {
  id: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  caption?: string;
  permalink?: string;
  timestamp?: string;
};

const API_BASE = 'https://api.ibuuvai.me';

async function request<T>(path: string): Promise<T> {
  const r = await fetch(`${API_BASE}${path}`, { headers: { Accept: 'application/json' } });
  if (!r.ok) throw new Error(`Request failed: ${r.status}`);
  return (await r.json()) as T;
}

export const getIgProfile = () => request<{ data: IgProfile } | IgProfile>('/ig/profile');
export const getIgMedia = (limit = 9) => request<{ data: IgMedia[] } | IgMedia[]>(`/ig/media?limit=${limit}`);


