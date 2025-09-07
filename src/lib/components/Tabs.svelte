<script lang="ts">
	const { selectedTab, onSelect } = $props<{
		selectedTab: 'stories' | 'journal' | 'about' | 'book';
		onSelect: (tab: 'stories' | 'journal' | 'about' | 'book') => void;
	}>();
</script>

<!-- Tab Navigation (structure preserved) -->
<div class="mx-auto mb-4 w-full max-w-3xl px-3 md:px-6">
	<div
		class="border-accent/20 shadow-accent/5 grid grid-cols-4 gap-1 rounded-xl border bg-black/30 p-1.5 shadow-lg backdrop-blur-md"
	>
		<button
			onclick={() => onSelect('about')}
			class="font-handwriting relative overflow-hidden rounded-lg px-4 py-3 text-center transition-all duration-300 {selectedTab ===
			'about'
				? 'text-accent bg-gradient-to-br from-black/80 to-black/60 font-bold shadow-inner'
				: 'hover:text-accent text-white hover:bg-black/40'}"
		>
			<span class="relative">Me</span>
			{#if selectedTab === 'about'}
				<div
					class="via-accent absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent to-transparent"
				></div>
			{:else}
				<div
					class="via-accent absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-transparent to-transparent opacity-0 transition-all duration-500 group-hover:w-full hover:opacity-100"
				></div>
			{/if}
		</button>

		<button
			onclick={() => onSelect('stories')}
			class="font-handwriting relative overflow-hidden rounded-lg px-4 py-3 text-center transition-all duration-300 {selectedTab ===
			'stories'
				? 'text-accent bg-gradient-to-br from-black/80 to-black/60 font-bold shadow-inner'
				: 'hover:text-accent text-white hover:bg-black/40'}"
		>
			<span class="relative">Stories</span>
			{#if selectedTab === 'stories'}
				<div
					class="via-accent absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent to-transparent"
				></div>
			{:else}
				<div
					class="via-accent absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-transparent to-transparent opacity-0 transition-all duration-500 group-hover:w-full hover:opacity-100"
				></div>
			{/if}
		</button>

		<button
			onclick={() => onSelect('journal')}
			class="font-handwriting relative overflow-hidden rounded-lg px-4 py-3 text-center transition-all duration-300 {selectedTab ===
			'journal'
				? 'text-accent bg-gradient-to-br from-black/80 to-black/60 font-bold shadow-inner'
				: 'hover:text-accent text-white hover:bg-black/40'}"
		>
			<span class="relative">Journal</span>
			{#if selectedTab === 'journal'}
				<div
					class="via-accent absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent to-transparent"
				></div>
			{:else}
				<div
					class="via-accent absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-transparent to-transparent opacity-0 transition-all duration-500 group-hover:w-full hover:opacity-100"
				></div>
			{/if}
		</button>

		<button
			onclick={() => onSelect('book')}
			class="font-handwriting relative overflow-hidden rounded-lg px-4 py-3 text-center transition-all duration-300 {selectedTab ===
			'book'
				? 'text-accent bg-gradient-to-br from-black/80 to-black/60 font-bold shadow-inner'
				: 'hover:text-accent text-white hover:bg-black/40'}"
		>
			<span class="relative z-10">My Book</span>
			{#if selectedTab === 'book'}
				<div
					class="via-accent absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent to-transparent"
				></div>
			{:else}
				<div
					class="via-accent absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-transparent to-transparent opacity-0 transition-all duration-500 group-hover:w-full hover:opacity-100"
				></div>
			{/if}
		</button>
	</div>
</div>
