<script lang="ts">
    import BackLink from '$lib/components/BackLink.svelte';
    import PageTitle from '$lib/components/PageTitle.svelte';
    import { getNowPlaying, getRecentlyPlayed, getTopTracks } from '$lib/api/spotifyClient';

    let now = $state<any>(null);
    let recent = $state<any>(null);
    let top = $state<any>(null);

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
            } catch (e) {
                console.error(e);
            }
        })();
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



