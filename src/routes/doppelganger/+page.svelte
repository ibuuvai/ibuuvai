<script lang="ts">
    import BackLink from '$lib/components/BackLink.svelte';
    import PageTitle from '$lib/components/PageTitle.svelte';
    import Icon from '@iconify/svelte';
    import { getInstagramProfile, getInstagramMedia } from '$lib/api/instagramClient';

    let profile = $state<any>(null);
    let media = $state<any>(null);

    $effect(() => {
        (async () => {
            try {
                const [p, m] = await Promise.all([
                    getInstagramProfile(),
                    getInstagramMedia(12)
                ]);
                profile = p;
                media = m;
            } catch (e) {
                console.error(e);
            }
        })();
    });
</script>

<svelte:head>
    <title>doppelgänger — ibuuvai</title>
    <meta name="description" content="reflections from instagram" />
    <meta name="robots" content="noindex,nofollow" />
    <!-- optional, until API is stable -->
    <meta property="og:title" content="doppelgänger — ibuuvai" />
</svelte:head>

<main class="min-h-[100svh] p-4">
    <PageTitle title="doppelgänger" />
    <BackLink />

    <section class="mx-auto mt-6 grid max-w-5xl grid-cols-1 items-start gap-5">
        <div class="manga-panel p-5" style="border-radius: var(--radius)">
            <div class="mb-2 flex items-center gap-2 text-xs uppercase opacity-60">
                <Icon icon="ph:instagram-logo" class="h-4 w-4" />
                <span>Instagram</span>
            </div>
            {#if profile}
                <div class="flex items-center gap-4">
                    {#if profile.profile_picture_url}
                        <img src={profile.profile_picture_url} alt="profile" class="h-14 w-14 rounded-full object-cover ring-1 ring-black" />
                    {/if}
                    <div>
                        <div class="text-xl">@{profile.username}</div>
                        {#if profile.biography}
                            <div class="opacity-70">{profile.biography}</div>
                        {/if}
                        <div class="mt-1 text-sm opacity-70">{profile.media_count ?? 0} posts</div>
                    </div>
                </div>
            {:else}
                <div class="opacity-60">Unable to load profile.</div>
            {/if}
        </div>

        <div class="manga-panel p-5" style="border-radius: var(--radius)">
            <div class="mb-2 text-xs uppercase opacity-60">Recent posts</div>
            {#if media?.data?.length}
                <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {#each media.data as it}
                        <a class="group block" href={it.permalink} target="_blank" rel="noreferrer">
                            {#if it.media_type === 'VIDEO'}
                                <div class="relative">
                                    <img src={it.thumbnail_url || it.media_url} alt={it.caption || 'post'} class="aspect-square w-full object-cover ring-1 ring-black" />
                                    <div class="absolute bottom-1 right-1 rounded bg-white/90 px-1 text-[10px] ring-1 ring-black">VIDEO</div>
                                </div>
                            {:else}
                                <img src={it.media_url} alt={it.caption || 'post'} class="aspect-square w-full object-cover ring-1 ring-black" />
                            {/if}
                            {#if it.caption}
                                <div class="mt-1 line-clamp-2 text-sm opacity-70">{it.caption}</div>
                            {/if}
                            <div class="text-[11px] opacity-60">{new Date(it.timestamp).toLocaleString()}</div>
                        </a>
                    {/each}
                </div>
            {:else}
                <div class="opacity-60">No posts available.</div>
            {/if}
        </div>
    </section>
</main>

<style>
    main {
        view-transition-name: canvas;
    }
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .aspect-square {
        aspect-ratio: 1 / 1;
    }
</style>


