<script lang="ts">
    import BackLink from '$lib/components/BackLink.svelte';
    import PageTitle from '$lib/components/PageTitle.svelte';
    import { getNowPlaying, getRecentlyPlayed, getTopTracks } from '$lib/api/spotifyClient';

    let now = $state<any>(null);
    let recent = $state<any>(null);
    let top = $state<any>(null);
    let baseProgressMs = $state(0);
    let durationMs = $state(0);
    let lastUpdateTs = $state(0);
    let liveProgressMs = $state(0);

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
                    getTopTracks('short_term', 10)
                ]);
                now = n;
                recent = r;
                top = t;
                baseProgressMs = n?.progress_ms ?? 0;
                durationMs = n?.item?.duration_ms ?? 0;
                lastUpdateTs = Date.now();
                liveProgressMs = Math.min(durationMs, baseProgressMs);
            } catch (e) {
                console.error(e);
            }
        })();

        const intervalId = setInterval(async () => {
            try {
                const n = await getNowPlaying();
                now = n;
                baseProgressMs = n?.progress_ms ?? 0;
                durationMs = n?.item?.duration_ms ?? 0;
                lastUpdateTs = Date.now();
                liveProgressMs = Math.min(durationMs, baseProgressMs);
            } catch (e) {
                console.error(e);
            }
        }, 15000); // match Worker cache TTL

        return () => clearInterval(intervalId);
    });

    // Local 1s ticker to animate progress bar smoothly between polls
    $effect(() => {
        const tick = setInterval(() => {
            if (!durationMs) return;
            const elapsed = Date.now() - lastUpdateTs;
            liveProgressMs = Math.min(durationMs, baseProgressMs + elapsed);
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
        <div class="manga-panel p-5" style="border-radius: var(--radius)">
            <div class="mb-2 text-xs uppercase opacity-60">Now playing</div>
            {#if now?.item}
                <div class="flex items-center gap-4">
                    <img src={now.item.album?.images?.[2]?.url || now.item.album?.images?.[0]?.url} alt="art" class="h-16 w-16 object-cover ring-1 ring-black" />
                    <div>
                        <div class="text-xl">{now.item.name}</div>
                        <div class="opacity-70">{now.item.artists?.map((a:any)=>a.name).join(', ')}</div>
                    </div>
                </div>
                <div class="mt-4">
                    <div class="h-2 w-full rounded-full bg-black/10">
                        <div
                            class="h-2 rounded-full bg-black"
                            style={`width: ${durationMs ? Math.min(100, (liveProgressMs / durationMs) * 100).toFixed(2) : 0}%`}
                        ></div>
                    </div>
                    <div class="mt-1 flex items-center justify-between text-xs opacity-70">
                        <span>{formatTime(liveProgressMs)}</span>
                        <a class="underline decoration-black/30 underline-offset-2 hover:decoration-black" href={now.item.external_urls?.spotify} target="_blank" rel="noreferrer">Open in Spotify</a>
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
            <div class="mb-2 text-xs uppercase opacity-60">Top tracks (short term)</div>
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



