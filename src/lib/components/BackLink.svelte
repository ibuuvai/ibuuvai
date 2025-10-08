<script lang="ts">
	let { href = '/', label = 'back' } = $props();
</script>

<a
	{href}
	class="mt-6 block tracking-wide lowercase underline decoration-black/20 underline-offset-4 transition-colors hover:decoration-black/60"
>
	{label}
</a>
