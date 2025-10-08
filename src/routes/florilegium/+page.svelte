<script lang="ts">
	import BackLink from '$lib/components/BackLink.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import FlorilegiumList from '$lib/components/FlorilegiumList.svelte';
	import { entries } from '$lib/data/florilegium';
</script>

<svelte:head>
	<title>Florilegium — ibuuvai</title>
	<meta name="description" content="a gathering of small pieces" />
</svelte:head>

<main class="min-h-[100dvh] p-4">
	<PageTitle title="florilegium" />
	<BackLink />
	<section class="mx-auto mt-6 grid max-w-5xl grid-cols-1 items-start">
		<div class="stack">
			<FlorilegiumList items={entries} />
		</div>
	</section>
</main>

<style>
	main {
		view-transition-name: canvas;
	}
</style>
