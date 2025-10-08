<script lang="ts">
	import BackLink from '$lib/components/BackLink.svelte';
	import FactsGrid from '$lib/components/FactsGrid.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import { facts } from '$lib/data/me';
    let previousBg = '';
    $effect(() => {
        const body = document.body;
        previousBg = body.style.backgroundImage;
        body.style.backgroundImage = "url('/images/me.webp')";
        return () => {
            body.style.backgroundImage = previousBg || "url('/images/background.webp')";
        };
    });
</script>

<svelte:head>
	<title>me — ibuuvai</title>
	<meta name="description" content="me — a living canvas." />
</svelte:head>

<main class="min-h-[100svh] p-4">
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
