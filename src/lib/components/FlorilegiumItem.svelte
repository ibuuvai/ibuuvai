<script lang="ts">
	let {
		title,
		content
	}: {
		title: string;
		content: string;
	} = $props();
	let open = $state(false);
	import Modal from './Modal.svelte';
</script>

<article class="border border-black bg-white shadow-[4px_4px_0_0_rgb(0,0,0)]">
	<button
		class="flex w-full items-center justify-between px-3 py-3 text-left"
		onclick={() => (open = true)}
	>
		<span class="tracking-wide lowercase">{title}</span>
	</button>
	<Modal {open} {content} onClose={() => (open = false)} />
</article>
