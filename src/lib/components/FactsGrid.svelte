<script lang="ts">
	import type { Fact } from '$lib/data/me';
	let { facts }: { facts: Fact[] } = $props();

	const nameFact = facts.find((f) => f.label.toLowerCase() === 'name') ?? facts[0];
	const otherFacts = facts.filter((f) => f !== nameFact);
</script>

<div class="grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] items-start gap-5">
	<!-- Name in its own full-width card -->
    <div class="manga-panel p-5 transition-transform hover:-translate-y-0.5" style="border-radius: var(--radius)">
		<div class="flex items-center gap-5">
			<div class="grid h-16 w-16 place-items-center bg-black ring-1 ring-black">
				<img src="/images/vai.webp" alt="profile" class="h-14 w-14 object-cover" />
			</div>
			<div>
				<div class="mb-1 text-xs uppercase opacity-60">Name</div>
				<div class="text-2xl leading-tight">{nameFact.value}</div>
			</div>
		</div>
	</div>

	<!-- Remaining facts combined in a second card (right column) -->
    <div class="manga-panel p-5 transition-transform hover:-translate-y-0.5" style="border-radius: var(--radius)">
		<div class="grid grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-4">
			{#each otherFacts as fact}
				<div>
					<div class="mb-1 text-xs uppercase opacity-60">{fact.label}</div>
					<div class="text-xl">{fact.value}</div>
				</div>
			{/each}
		</div>
	</div>
</div>
