<script lang="ts">
  import { page } from '$app/state';
</script>

<div class="h-screen flex flex-col justify-center items-center relative overflow-hidden">
  <div class="absolute inset-0 z-0">
    <div class="absolute inset-0 opacity-90 bg-primary"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full filter blur-3xl animate-glow-pulse bg-accent/20"></div>
  </div>
  
  <h1 class="text-5xl md:text-7xl font-black relative z-10 mb-6 text-center px-4 text-white">
    <span class="text-accent animate-pulse-subtle">{page.status}</span>
  </h1>
  
  <p class="text-xl md:text-2xl max-w-xl text-center px-6 relative z-10 mb-12 text-white animate-fade-in">
    {page.error?.message || 'The page you are looking for has dissolved into the darkness.'}
  </p>
  
  <a href="/" class="relative z-10 px-8 py-3 bg-transparent border-2 border-accent text-accent hover:bg-accent/10 hover:shadow-violet transition-all duration-300 animate-fade-in">
    Return to the Beginning
  </a>
</div> 