<script lang="ts">
	import type { Fact } from '$lib/data/me';
	let { facts }: { facts: Fact[] } = $props();

	const nameFact = facts.find((f) => f.label.toLowerCase() === 'name') ?? facts[0];
	const otherFacts = facts.filter((f) => f !== nameFact);
</script>

<div class="grid grid-cols-1 items-start gap-4 sm:grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]">
	<div
		class="manga-panel p-4 transition-transform hover:-translate-y-0.5 sm:p-5"
		style="border-radius: var(--radius)"
	>
		<div class="flex items-center gap-4 sm:gap-5">
			<div class="grid h-14 w-14 place-items-center bg-black ring-1 ring-black sm:h-16 sm:w-16">
				<img src="/images/vai.webp" alt="profile" class="h-12 w-12 object-cover sm:h-14 sm:w-14" />
			</div>
			<div>
				<div class="mb-1 text-[11px] uppercase opacity-60 sm:text-xs">Name</div>
				<div class="text-xl leading-tight lowercase sm:text-2xl">{nameFact.value}</div>
			</div>
		</div>
	</div>

	<div
		class="manga-panel p-4 transition-transform hover:-translate-y-0.5 sm:p-5"
		style="border-radius: var(--radius)"
	>
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] sm:gap-4">
			{#each otherFacts as fact}
				<div>
					<div class="mb-1 text-[11px] uppercase opacity-60 sm:text-xs">{fact.label}</div>
					<div class="text-base lowercase sm:text-lg">{fact.value}</div>
				</div>
			{/each}
		</div>
	</div>
</div>
