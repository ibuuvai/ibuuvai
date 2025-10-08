<script lang="ts">
	import FlorilegiumItem from './FlorilegiumItem.svelte';
	let { items }: { items: { title: string; content: string }[] } = $props();
</script>

<div class="grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-3">
	{#each items as it}
		<FlorilegiumItem title={it.title} content={it.content} />
	{/each}
</div>
