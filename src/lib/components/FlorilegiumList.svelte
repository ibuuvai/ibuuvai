<script lang="ts">
	import FlorilegiumItem from './FlorilegiumItem.svelte';
	let { items }: { items: { title: string; content: string }[] } = $props();
</script>

<div class="flex flex-col gap-5">
	{#each items as it, i}
		<FlorilegiumItem number={items.length - i} index={i} title={it.title} content={it.content} />
	{/each}
</div>
