<script lang="ts">
  import { page } from '$app/stores';
  
  const { activeTab = 'stories' } = $props<{
    activeTab?: 'stories' | 'journal' | 'about';
  }>();
</script>

<div class="w-full max-w-3xl mx-auto my-8 px-4">
  <div class="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-1 flex justify-between">
    <a 
      href="/stories" 
      class="flex-1 py-3 px-4 text-center rounded-lg transition-all duration-300 {activeTab === 'stories' ? 'bg-black/80 text-white' : 'text-white/70 hover:text-white hover:bg-black/40'}"
    >
      Stories
    </a>
    <a 
      href="/journal" 
      class="flex-1 py-3 px-4 text-center rounded-lg transition-all duration-300 {activeTab === 'journal' ? 'bg-black/80 text-white' : 'text-white/70 hover:text-white hover:bg-black/40'}"
    >
      Journal
    </a>
    <a 
      href="/about" 
      class="flex-1 py-3 px-4 text-center rounded-lg transition-all duration-300 {activeTab === 'about' ? 'bg-black/80 text-white' : 'text-white/70 hover:text-white hover:bg-black/40'}"
    >
      About Me
    </a>
  </div>
</div> 