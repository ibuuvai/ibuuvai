<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  
  const { mounted } = $props<{
    mounted: boolean;
  }>();
</script>

<!-- Hero Section -->
<section class="h-screen flex flex-col justify-center items-center relative overflow-hidden">
  {#if mounted}
    <div 
      in:fade={{ duration: 1500, delay: 300 }}
      class="absolute inset-0 z-0"
    >
      <div class="absolute inset-0 opacity-90 bg-primary"></div>
    </div>
    
    <div
      in:fade={{ duration: 1000, delay: 400 }}
      class="relative z-10 max-w-4xl mx-auto"
    >
      <div 
        in:fade={{ duration: 1200, delay: 500 }}
        class="mb-16 flex flex-col items-center justify-center"
      >
        <img 
          src="/images/vai.webp" 
          alt="Creator Avatar" 
          class="w-48 h-48 animate-pulse-subtle mb-4"
        />
        <span class="text-3xl md:text-5xl font-black text-accent animate-text-focus font-handwriting uppercase">VAI Ibuu</span>
        <div class="mt-2 text-center">
          <p class="text-lg text-white font-handwriting uppercase font-bold">My existence isn't known by anybody else</p>
          <p class="text-lg text-white font-handwriting">I wave my hand aimlessly over a coloring page</p>
        </div>
      </div>
      
      <div class="text-center mt-8">
        <div class="relative inline-block">
          <div class="absolute inset-0 bg-[#8B0000]/20 blur-md -m-2"></div>
          <h1 
            in:fly={{ y: 50, duration: 1200, delay: 800 }}
            class="relative text-5xl md:text-7xl font-black mb-3 px-4 text-[#8B0000] animate-text-focus font-creepy"
          >
            Keep out
          </h1>
        </div>
        
        <p 
          in:fly={{ y: 30, duration: 1000, delay: 1200 }}
          class="text-xl md:text-2xl max-w-xl text-center px-6 mx-auto text-white animate-fade-in mt-6 font-handwriting"
        >
          So that I will not be fooled...<br>
          So that I won't drag you into this—<br>
          <span class="text-[#8B0000] font-bold font-creepy">stay away</span>
        </p>
      </div>
    </div>
    
    <div 
      in:fade={{ duration: 1000, delay: 2000 }}
      class="absolute bottom-12 left-1/2 -translate-x-1/2"
    >
      <div class="flex flex-col items-center">
        <div class="w-2 h-2 bg-[#8B0000] rounded-full animate-pulse-slow"></div>
        <div class="w-1.5 h-1.5 bg-[#8B0000] rounded-full mt-2 animate-pulse-subtle"></div>
      </div>
    </div>
  {/if}
</section> 