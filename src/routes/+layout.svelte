<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="bg-primary text-secondary min-h-screen">
	{@render children()}
</div>

<style>
	:global(html) {
		scrollbar-width: thin;
		scrollbar-color: var(--color-accent) var(--color-primary);
	}

	:global(::-webkit-scrollbar) {
		width: 8px;
	}

	:global(::-webkit-scrollbar-track) {
		background: var(--color-primary);
	}

	:global(::-webkit-scrollbar-thumb) {
		background-color: var(--color-accent);
		border-radius: 20px;
	}
</style>
