<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  const { scrollY, innerHeight } = $props<{
    scrollY: number;
    innerHeight: number;
  }>();
  
  let scrollProgress = $state(0);
  
  $effect(() => {
    if (browser && scrollY !== undefined && innerHeight !== undefined) {
      scrollProgress = scrollY / (document.body.scrollHeight - innerHeight) || 0;
      document.documentElement.style.setProperty('--scroll-y', scrollY.toString());
    }
  });
</script>

<!-- Optional visual indicator of scroll progress -->
{#if browser}
  <div class="fixed top-0 left-0 w-full h-1 z-50">
    <div class="h-full bg-accent/50" style="width: {scrollProgress * 100}%"></div>
  </div>
{/if} 