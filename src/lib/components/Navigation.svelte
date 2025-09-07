<script lang="ts">
	const { activeTab = 'stories' } = $props<{
		activeTab?: 'stories' | 'journal' | 'about';
	}>();
</script>

<div class="mx-auto my-8 w-full max-w-3xl px-4">
	<div
		class="flex justify-between rounded-xl border border-white/10 bg-black/20 p-1 backdrop-blur-sm"
	>
		<a
			href="/stories"
			class="flex-1 rounded-lg px-4 py-3 text-center transition-all duration-300 {activeTab ===
			'stories'
				? 'bg-black/80 text-white'
				: 'text-white/70 hover:bg-black/40 hover:text-white'}"
		>
			Stories
		</a>
		<a
			href="/journal"
			class="flex-1 rounded-lg px-4 py-3 text-center transition-all duration-300 {activeTab ===
			'journal'
				? 'bg-black/80 text-white'
				: 'text-white/70 hover:bg-black/40 hover:text-white'}"
		>
			Journal
		</a>
		<a
			href="/about"
			class="flex-1 rounded-lg px-4 py-3 text-center transition-all duration-300 {activeTab ===
			'about'
				? 'bg-black/80 text-white'
				: 'text-white/70 hover:bg-black/40 hover:text-white'}"
		>
			About Me
		</a>
	</div>
</div>
