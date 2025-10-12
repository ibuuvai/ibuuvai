<script lang="ts">
	import Icon from '@iconify/svelte';
</script>

<svelte:head>
	<title>ibuuvai</title>
	<meta name="description" content="a quiet canvas." />
</svelte:head>

<main class="min-h-[100svh] p-6 pt-20">
	<div class="mx-auto max-w-5xl space-y-6">
		<a
			href="/me"
			class="manga-panel group block w-full max-w-[40rem] p-5 transition-transform hover:-translate-y-0.5 sm:w-[44%]"
			style="border-radius: var(--radius)"
		>
			<div class="flex items-center gap-3">
				<Icon icon="ph:user" class="h-5 w-5 opacity-70" />
				<span class="text-xl tracking-wide lowercase">me</span>
			</div>
		</a>

		<div class="flex justify-end">
			<a
				href="/florilegium"
				class="manga-panel group block w-full max-w-[40rem] p-5 transition-transform hover:-translate-y-0.5 sm:w-[44%]"
				style="border-radius: var(--radius)"
			>
				<div class="flex items-center gap-3">
					<Icon icon="ph:flower" class="h-5 w-5 opacity-70" />
					<span class="text-xl tracking-wide lowercase">florilegium</span>
				</div>
			</a>
		</div>

		<a
			href="/whispers"
			class="manga-panel group block w-full max-w-[40rem] p-5 transition-transform hover:-translate-y-0.5 sm:w-[44%]"
			style="border-radius: var(--radius)"
		>
			<div class="flex items-center gap-3">
				<Icon icon="ph:music-notes" class="h-5 w-5 opacity-70" />
				<span class="text-xl tracking-wide lowercase">whispers</span>
			</div>
		</a>
	</div>
</main>

<style>
	main {
		view-transition-name: canvas;
	}
</style>
