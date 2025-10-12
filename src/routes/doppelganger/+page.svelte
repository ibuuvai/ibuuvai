<script lang="ts">
  import BackLink from '$lib/components/BackLink.svelte';
  import PageTitle from '$lib/components/PageTitle.svelte';
  import Icon from '@iconify/svelte';

  import { getIgMedia, getIgProfile, type IgProfile, type IgMedia } from '$lib/api/instagramClient';

  let profile = $state<IgProfile>(null);
  let media = $state<IgMedia[] | null>(null);
  let errorMessage = $state<string>('');

  async function loadInstagram() {
    try {
      const [p, m] = await Promise.all([getIgProfile(), getIgMedia(9)]);
      profile = (p as any)?.data ?? (p as any) ?? null;
      media = (m as any)?.data ?? (m as any) ?? null;
    } catch (e) {
      errorMessage = 'Failed to load Instagram data';
      console.error(e);
    }
  }

  $effect(() => {
    loadInstagram();
  });
</script>

<svelte:head>
  <title>doppelgänger — ibuuvai</title>
  <meta name="description" content="mirrors of a feed" />
</svelte:head>

<main class="min-h-[100svh] p-4">
  <PageTitle title="doppelgänger" />
  <BackLink />

  <section class="mx-auto mt-6 grid max-w-5xl grid-cols-1 items-start gap-5">
    <div class="manga-panel p-5" style="border-radius: var(--radius)">
      <div class="mb-2 text-xs uppercase opacity-60">Profile</div>
      {#if errorMessage}
        <div class="opacity-60">{errorMessage}</div>
      {:else if profile}
        <div class="flex items-center gap-4">
          {#if profile?.profile_picture_url}
            <img src={profile.profile_picture_url} alt="avatar" class="h-16 w-16 object-cover ring-1 ring-black" />
          {:else}
            <div class="grid h-16 w-16 place-items-center ring-1 ring-black">
              <Icon icon="ph:instagram-logo" class="h-6 w-6 opacity-60" />
            </div>
          {/if}
          <div>
            <div class="text-xl">@{profile?.username}</div>
            <div class="opacity-70">{profile?.bio}</div>
            <div class="mt-1 text-xs opacity-70">
              {#if profile?.media_count}{profile.media_count} posts{/if}
            </div>
          </div>
        </div>
      {:else}
        <div class="opacity-60">Loading…</div>
      {/if}
    </div>

    <div class="manga-panel p-5" style="border-radius: var(--radius)">
      <div class="mb-2 text-xs uppercase opacity-60">Recent posts</div>
      {#if media}
        {#if media.length === 0}
          <div class="opacity-60">No posts</div>
        {:else}
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {#each media as m}
              <div class="manga-card group overflow-hidden bg-white" style="border-radius: var(--radius)">
                <div class="relative">
                  <img src={m.thumbnail_url || m.media_url} alt={m.caption || ''} class="aspect-square w-full object-cover" />
                  {#if m.timestamp}
                    <div class="pointer-events-none absolute left-2 top-2">
                      <span class="no-badge">{new Date(m.timestamp).toLocaleDateString()}</span>
                    </div>
                  {/if}
                </div>
                {#if m.caption}
                  <div class="px-3 py-2 text-sm leading-snug">
                    <div class="line-clamp-3 opacity-80">{m.caption}</div>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      {:else}
        <div class="opacity-60">Loading…</div>
      {/if}
    </div>
  </section>
</main>

<style>
  main {
    view-transition-name: canvas;
  }
</style>


