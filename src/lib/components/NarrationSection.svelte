<script lang="ts">
  const props = $props<{
    title: string;
    position?: 'left' | 'right' | 'center';
    blurPosition?: string;
    blurSize?: string;
    children: any;
  }>();
  
  // Set default values
  const position = $derived(props.position ?? 'right');
  const blurPosition = $derived(props.blurPosition ?? 'right-0 top-1/2 -translate-y-1/2');
  const blurSize = $derived(props.blurSize ?? 'w-64 h-64');
  
  // Add state for content visibility
  let isContentVisible = $state(false);
  
  // Toggle content visibility
  function toggleContent() {
    isContentVisible = !isContentVisible;
  }
</script>

<section class="min-h-screen py-24 px-6 md:px-12 flex flex-col justify-center relative">
  <div class="max-w-3xl mx-auto">
    <h2 
      class="text-3xl md:text-4xl font-bold mb-8 text-accent animate-fade-in font-creepy cursor-pointer flex items-center"
      on:click={toggleContent}
      on:keydown={(e) => e.key === 'Enter' && toggleContent()}
      tabindex="0"
      role="button"
      aria-expanded={isContentVisible}
    >
      {props.title}
      <span class="ml-2 text-sm transition-transform duration-300" class:rotate-180={isContentVisible}>
        {isContentVisible ? '▲' : '▼'}
      </span>
    </h2>
    
    <!-- svelte-ignore slot_element_deprecated -->
    {#if isContentVisible}
      <div class="prose prose-violet max-w-none animate-slide-up">
        {@render props.children()}
      </div>
    {/if}
  </div>
  
  <div class="absolute {blurPosition} {blurSize} rounded-full filter blur-3xl bg-accent/10"></div>
</section> 