<script lang="ts">
	const props = $props<{
		title: string;
		position?: 'left' | 'right' | 'center';
		blurPosition?: string;
		blurSize?: string;
		children: any;
	}>();

	// Set default values
	const position = $derived(props.position ?? 'right');
	const blurPosition = $derived(props.blurPosition ?? 'right-0 top-1/2 -translate-y-1/2');
	const blurSize = $derived(props.blurSize ?? 'w-64 h-64');

	// Calculate different sizes for the layered glows
	const blurSizeLarge = $derived(blurSize.replace('w-64', 'w-80').replace('h-64', 'h-80'));
	const blurSizeSmall = $derived(blurSize.replace('w-64', 'w-48').replace('h-64', 'h-48'));

	// Add state for content visibility
	let isContentVisible = $state(false);

	// Toggle content visibility
	function toggleContent() {
		isContentVisible = !isContentVisible;
	}
</script>

<section class="relative flex min-h-screen flex-col justify-center px-6 py-24 md:px-12">
	<div class="mx-auto max-w-3xl">
		<h2 class="text-accent animate-fade-in font-creepy mb-8 text-3xl font-bold md:text-4xl">
			<button
				type="button"
				class="flex cursor-pointer items-center"
				onclick={toggleContent}
				aria-expanded={isContentVisible}
			>
				{props.title}
				<span
					class="ml-2 text-sm transition-transform duration-300"
					class:rotate-180={isContentVisible}
				>
					{isContentVisible ? '▲' : '▼'}
				</span>
			</button>
		</h2>

		<!-- svelte-ignore slot_element_deprecated -->
		{#if isContentVisible}
			<div class="prose prose-violet animate-slide-up max-w-none">
				{@render props.children()}
			</div>
		{/if}
	</div>

	<!-- Simple, clean glow effect -->
	<div
		class="absolute {blurPosition} {blurSize} bg-accent/15 rounded-full opacity-70 blur-[25px]"
	></div>
</section>
