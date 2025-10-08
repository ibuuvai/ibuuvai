<script lang="ts">
	let { title }: { title: string } = $props();
</script>

<header class="relative mt-0 mb-0">
	<div class="h-16 border-2 border-black shadow-[6px_6px_0_0_rgb(0,0,0)]">
		<div class="dot-bg h-full w-full"></div>
	</div>
	<div class="pointer-events-none absolute inset-0 grid place-items-center">
		<span
			class="border-2 border-black bg-white px-4 py-1.5 text-lg font-semibold tracking-wide lowercase"
		>
			{title}
		</span>
	</div>
</header>
