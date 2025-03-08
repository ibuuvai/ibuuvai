<script lang="ts">
  import { onMount } from 'svelte';
  
  // Import components
  import HeroSection from '$lib/components/HeroSection.svelte';
  import FooterSection from '$lib/components/FooterSection.svelte';
  import ScrollProgress from '$lib/components/ScrollProgress.svelte';
  
  let mounted = $state(false);
  let scrollY = $state(0);
  let innerHeight = $state(0);
  
  onMount(() => {
    mounted = true;
  });
</script>

<svelte:head>
  <title>VAI IBUU</title>
  <meta name="description" content="A digital narrative exploring existence, isolation, and the search for meaning." />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Cutive+Mono&family=Major+Mono+Display&display=swap" rel="stylesheet">
</svelte:head>

<svelte:window bind:scrollY bind:innerHeight />

<ScrollProgress {scrollY} {innerHeight} />

<!-- Hero Section -->
<HeroSection {mounted} />

<!-- Footer Section -->
<FooterSection activeTab="stories" />
