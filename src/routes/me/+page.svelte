<script lang="ts">
	import BackLink from '$lib/components/BackLink.svelte';
	import FactsGrid from '$lib/components/FactsGrid.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import { facts } from '$lib/data/me';
	// optional: icons can be attached at data level later
</script>

<svelte:head>
	<title>me — ibuuvai</title>
	<meta name="description" content="me — a living canvas." />
</svelte:head>

<main class="min-h-screen p-4">
	<PageTitle title="me" />
	<BackLink />
	<section class="mx-auto mt-6 grid max-w-5xl grid-cols-1 items-start">
		<div class="stack">
			<FactsGrid {facts} />
		</div>
	</section>
</main>

<style>
	main {
		view-transition-name: canvas;
	}
</style>
