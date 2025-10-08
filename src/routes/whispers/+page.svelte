<script lang="ts">
    import BackLink from '$lib/components/BackLink.svelte';
    import PageTitle from '$lib/components/PageTitle.svelte';
    import { getNowPlaying, getRecentlyPlayed, getTopTracks } from '$lib/api/spotifyClient';
    import Icon from '@iconify/svelte';

    let now = $state<any>(null);
    let recent = $state<any>(null);
    let top = $state<any>(null);
    let baseProgressMs = $state(0);
    let durationMs = $state(0);
    let lastUpdateTs = $state(0);
    let liveProgressMs = $state(0);
    let isPlaying = $state(false);
    let endTimer: number | null = null;

    async function refreshRecent() {
        try {
            recent = await getRecentlyPlayed(10);
        } catch (e) {
            console.error(e);
        }
    }

    async function refreshNow(fetchRecentOnChange = false) {
        try {
            const prevId = now?.item?.id;
            const n = await getNowPlaying();
            now = n;
            const nextId = n?.item?.id;
            if (prevId && nextId && prevId === nextId) {
                durationMs = n?.item?.duration_ms ?? durationMs;
                baseProgressMs = Math.max(baseProgressMs, n?.progress_ms ?? 0);
            } else {
                baseProgressMs = n?.progress_ms ?? 0;
                durationMs = n?.item?.duration_ms ?? 0;
                if (fetchRecentOnChange) await refreshRecent();
            }
            lastUpdateTs = Date.now();
            liveProgressMs = Math.min(durationMs, baseProgressMs);
            isPlaying = Boolean(n?.is_playing);
            scheduleEdgeRefresh();
        } catch (e) {
            console.error(e);
        }
    }

    function scheduleEdgeRefresh() {
        if (endTimer) clearTimeout(endTimer);
        if (!durationMs) return;
        const remaining = Math.max(0, durationMs - liveProgressMs);
        const delay = Math.max(1500, remaining + 200); // small buffer after expected end
        endTimer = setTimeout(async () => {
            await refreshNow(true);
        }, delay) as unknown as number;
    }

    function togglePlayLocal() {
        if (!durationMs) return;
        if (isPlaying) {
            // Pause locally: freeze progress at current computed position
            baseProgressMs = Math.min(durationMs, liveProgressMs);
            lastUpdateTs = Date.now();
            isPlaying = false;
        } else {
            // Resume locally: continue advancing from current position
            baseProgressMs = Math.min(durationMs, liveProgressMs);
            lastUpdateTs = Date.now();
            isPlaying = true;
        }
    }

    function formatTime(ms: number) {
        const s = Math.floor(ms / 1000);
        const m = Math.floor(s / 60);
        const ss = String(s % 60).padStart(2, '0');
        return `${m}:${ss}`;
    }

    $effect(() => {
        (async () => {
            try {
                const [n, r, t] = await Promise.all([
                    getNowPlaying(),
                    getRecentlyPlayed(10),
                    getTopTracks('medium_term', 10)
                ]);
                now = n;
                recent = r;
                top = t;
                baseProgressMs = n?.progress_ms ?? 0;
                durationMs = n?.item?.duration_ms ?? 0;
                lastUpdateTs = Date.now();
                liveProgressMs = Math.min(durationMs, baseProgressMs);
                isPlaying = Boolean(n?.is_playing);
                scheduleEdgeRefresh();
            } catch (e) {
                console.error(e);
            }
        })();

        const nowInterval = setInterval(() => refreshNow(true), 15000);

        return () => {
            clearInterval(nowInterval);
            if (endTimer) clearTimeout(endTimer);
        };
    });

    // Local 1s ticker to animate progress bar smoothly between polls
    $effect(() => {
        const tick = setInterval(() => {
            if (!durationMs) return;
            if (isPlaying) {
                const elapsed = Date.now() - lastUpdateTs;
                liveProgressMs = Math.min(durationMs, baseProgressMs + elapsed);
            } else {
                liveProgressMs = Math.min(durationMs, baseProgressMs);
            }
        }, 1000);
        return () => clearInterval(tick);
    });
</script>

<svelte:head>
    <title>whispers — ibuuvai</title>
    <meta name="description" content="soft, quiet notes" />
</svelte:head>

<main class="min-h-[100dvh] p-4">
    <PageTitle title="whispers" />
    <BackLink />
    <section class="mx-auto mt-6 grid max-w-5xl grid-cols-1 items-start gap-5">
        <div class="manga-panel relative p-5" style="border-radius: var(--radius)">
            <div class="mb-2 text-xs uppercase opacity-60">Now playing</div>
            {#if now?.item}
                <div class="flex items-center gap-4">
                    <img src={now.item.album?.images?.[2]?.url || now.item.album?.images?.[0]?.url} alt="art" class="h-16 w-16 object-cover ring-1 ring-black" />
                    <div>
                        <div class="text-xl">{now.item.name}</div>
                        <div class="opacity-70">{now.item.artists?.map((a:any)=>a.name).join(', ')}</div>
                        {#if !isPlaying}
                            <div class="mt-1 inline-block rounded px-2 py-0.5 text-xs uppercase opacity-70 ring-1 ring-black">paused</div>
                        {/if}
                    </div>
                </div>
                <a class="manga-panel absolute right-3 top-3 inline-flex items-center gap-1 px-3 py-1 no-underline text-[11px] opacity-100" style="border-radius: var(--radius)" href={now.item.external_urls?.spotify} target="_blank" rel="noreferrer" aria-label="Open in Spotify">
                    <Icon icon="ph:spotify-logo" class="h-3 w-3" />
                    <span>Open in Spotify</span>
                </a>
                <div class="mt-6">
                    <div class="mt-2 mb-8 grid w-full grid-cols-3 items-center px-6 md:px-12">
                        <div class="flex justify-start">
                            <button
                                class="manga-panel grid h-12 w-12 place-items-center p-0 text-lg transition-transform duration-150 hover:-translate-y-0.5 active:scale-95"
                                style="border-radius: var(--radius)"
                                aria-label="Previous (mock)"
                                title="mock control"
                            >
                                <Icon icon="ph:skip-back" />
                            </button>
                        </div>
                        <div class="flex justify-center">
                            <button
                                class="manga-panel grid h-14 w-14 place-items-center p-0 text-xl transition-transform duration-150 hover:-translate-y-0.5 active:scale-95"
                                style="border-radius: var(--radius)"
                                aria-label="Play/Pause (mock)"
                                title="mock control"
                            >
                                {#if isPlaying}
                                    <Icon icon="ph:pause" />
                                {:else}
                                    <Icon icon="ph:play" />
                                {/if}
                            </button>
                        </div>
                        <div class="flex justify-end">
                            <button
                                class="manga-panel grid h-12 w-12 place-items-center p-0 text-lg transition-transform duration-150 hover:-translate-y-0.5 active:scale-95"
                                style="border-radius: var(--radius)"
                                aria-label="Next (mock)"
                                title="mock control"
                            >
                                <Icon icon="ph:skip-forward" />
                            </button>
                        </div>
                    </div>
                    <div class="h-2 w-full rounded-full bg-black/10">
                        <div
                            class="h-2 rounded-full bg-black"
                            style={`width: ${durationMs ? Math.min(100, (liveProgressMs / durationMs) * 100).toFixed(2) : 0}%`}
                        ></div>
                    </div>
                    <div class="mt-1 flex items-center justify-between text-xs opacity-70">
                        <span>{formatTime(liveProgressMs)}</span>
                        <span>{formatTime(durationMs)}</span>
                    </div>
                </div>
            {:else}
                <div class="opacity-60">Nothing playing</div>
            {/if}
        </div>

        <div class="manga-panel p-5" style="border-radius: var(--radius)">
            <div class="mb-2 text-xs uppercase opacity-60">Recently played</div>
            {#if recent?.items}
                <div class="grid grid-cols-1 gap-3">
                    {#each recent.items.slice(0,10) as it}
                        <div class="flex items-center gap-3">
                            <img src={it.track.album?.images?.[2]?.url || it.track.album?.images?.[0]?.url} alt="art" class="h-10 w-10 object-cover ring-1 ring-black" />
                            <div>
                                <div class="text-base">{it.track.name}</div>
                                <div class="text-sm opacity-70">{it.track.artists?.map((a:any)=>a.name).join(', ')}</div>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="opacity-60">No recent tracks</div>
            {/if}
        </div>

        <div class="manga-panel p-5" style="border-radius: var(--radius)">
            <div class="mb-2 text-xs uppercase opacity-60">Top tracks</div>
            {#if top?.items}
                <div class="grid grid-cols-1 gap-3">
                    {#each top.items.slice(0,10) as t, i}
                        <div class="flex items-center gap-3">
                            <span class="no-badge">no. {String(i+1).padStart(2,'0')}</span>
                            <img src={t.album?.images?.[2]?.url || t.album?.images?.[0]?.url} alt="art" class="h-10 w-10 object-cover ring-1 ring-black" />
                            <div>
                                <div class="text-base">{t.name}</div>
                                <div class="text-sm opacity-70">{t.artists?.map((a:any)=>a.name).join(', ')}</div>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="opacity-60">No data</div>
            {/if}
        </div>
    </section>
    
</main>

<style>
    main {
        view-transition-name: canvas;
    }
    
</style>



