<script lang="ts">
	import { slide } from 'svelte/transition';
	const {
		entries,
		openId = null,
		onToggle
	} = $props<{
		entries: Array<{ id: string; title: string; content: string }>;
		openId?: string | null;
		onToggle: (id: string) => void;
	}>();
</script>

<ul class="space-y-4">
	{#each entries as entry}
		<li class="border-accent/10 border-b pb-3" id={'entry-' + entry.id} data-reveal>
			<button
				onclick={() => onToggle(entry.id)}
			class="hover:text-accent group relative flex w-full flex-col py-2 text-left text-white transition-colors sm:flex-row sm:items-center sm:justify-between"
			>
				<div class="flex items-center">
					<span class="mr-2 inline-block h-4 w-4 flex-shrink-0">
						{#if openId === entry.id}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="text-accent h-4 w-4"
							>
								<path d="M6 9l6 6 6-6" />
							</svg>
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
				class="group-hover:text-accent/70 h-4 w-4 text-white/50"
							>
								<path d="M9 18l6-6-6-6" />
							</svg>
						{/if}
					</span>
					<span
						class={'font-handwriting group-hover:text-accent text-base transition-colors ' +
							(openId === entry.id ? 'text-accent' : '')}>{entry.title}</span
					>
				</div>

			</button>

			{#if openId === entry.id}
				<div
					in:slide={{ duration: 300 }}
			class="border-accent/10 font-handwriting mt-3 rounded-lg border bg-white px-4 py-3 text-left text-sm leading-relaxed whitespace-pre-line text-black shadow-accent/5 shadow"
				>
					{entry.content}
				</div>
			{/if}
		</li>
	{/each}
</ul>
