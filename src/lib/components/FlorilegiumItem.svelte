<script lang="ts">
	let {
		title,
		content,
		index,
		number
	}: {
		title: string;
		content: string;
		index?: number;
		number?: number;
	} = $props();
	let open = $state(false);
	import Modal from './Modal.svelte';
</script>

<article class="manga-panel transition-transform hover:-translate-y-0.5" style="border-radius: var(--radius)">
    <button
        class="flex w-full items-center gap-4 px-4 py-4 text-left"
		style="border-radius: var(--radius)"
		onclick={() => (open = true)}
	>
		<span class="no-badge">no. {String(number ?? (index ?? 0) + 1).padStart(2, '0')}</span>
		<span class="tracking-wide lowercase text-xl">{title}</span>
	</button>
</article>

<Modal {open} {content} onClose={() => (open = false)} />
