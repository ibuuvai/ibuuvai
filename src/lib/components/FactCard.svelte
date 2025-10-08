<script lang="ts">
	import Icon from '@iconify/svelte';
	let {
		label,
		value,
		icon = 'ph:dot-outline'
	}: { label: string; value: string; icon?: string } = $props();
</script>

<div class="border border-black bg-white px-4 py-3 shadow-[4px_4px_0_0_rgb(0,0,0)]">
	<div class="mb-1 flex items-center gap-2 text-xs opacity-60">
		<Icon {icon} class="h-4 w-4" />
		<span class="uppercase">{label}</span>
	</div>
	<div class="text-base">{value}</div>
</div>
