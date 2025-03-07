<script lang="ts">
  import { onMount } from 'svelte';
  
  // Import components
  import HeroSection from '$lib/components/HeroSection.svelte';
  import NarrationSection from '$lib/components/NarrationSection.svelte';
  import FooterSection from '$lib/components/FooterSection.svelte';
  import Quote from '$lib/components/Quote.svelte';
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
<!-- Narrative Section -->
<NarrationSection 
  title="Nontitled" 
  blurPosition="right-0 top-1/2 -translate-y-1/2" 
  blurSize="w-64 h-64"
>
  <p>Loneliness and love are foreign concepts, distant and incomprehensible, our human forms already cast aside, discarded long ago. Proof of existence is reduced to empty words, scattered meaningless across a cramped, suffocating stage. We are performers without an audience, each desperately acting out our roles, running breathlessly towards the end credits, even though the seats remain vacant.</p>
  
  <p>The person I once recognized as myself is no longer here, lost somewhere beyond memory. I can't recall a single part I was suited to play. Now, the encore has arrived—surely, we are all holding our breath, waiting for the dramatic twist. Yet, what do those eyes of yours see? There was a time when we were innocent, untouched; but before we realized it, we had turned into monsters.</p>
  
  <p>Without warning, I became nothing more than a side character, my voice lost amidst overwhelming noise. Everyone around desperately shields themselves, secretly yearning for a savior's hand to appear. Alone, I shed tears, unable to find the truths I had carefully hidden. Looking back, hadn't I discarded every emotion? Yet, the tears still flowed inexplicably. Warmth and kindness seem suspicious now, every offered hand is mistrusted. Love seeps slowly from the wound in my heart, and your gaze threatens my collapse. How pitiful I must appear, caught dancing precariously between love and hatred.</p>
  
  <p>Enough—I long for ignorance now. Words have become meaningless.</p>
  
  <Quote text="Hey, let's run away to somewhere far away—a place that's not here." />
  
  <p>A place where the morning dawn gently spills through the wooden cracks, illuminating a forgotten path once caressed by winds beneath an eternal springtime sky. A place free of scripts, devoid of lines or directors, where every moment is fleeting, impossible to retake. A world beyond the frame of any camera, a reality untouched even by the widest of lenses. In this hidden place, we could taste suspiciously bright fruits without fear of judgment.</p>
  
  <p>No one would cry for us. The title flashing across the screen just before the end—a story unremembered, incredibly ordinary. This title, abandoned like refuse, without even the dignity of a name, belongs solely to you and me.</p>
</NarrationSection>

<!-- Footer Section -->
<FooterSection activeTab="stories" />
