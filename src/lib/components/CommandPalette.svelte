<script lang="ts">
	import { onMount } from 'svelte';
	const {
		journalEntries = [] as Array<{ id: string; title: string }>,
		navigateToTab,
		openJournal
	} = $props<{
		journalEntries?: Array<{ id: string; title: string }>;
		navigateToTab: (tab: 'stories' | 'journal' | 'about' | 'book') => void;
		openJournal: (id: string) => void;
	}>();

	let isOpen = $state(false);
	let query = $state('');
	let activeIndex = $state(0);
	let modalEl: HTMLElement | null = null;
	let previouslyFocused: Element | null = null;

	const commands = $derived([
		{ type: 'tab', id: 'about', title: 'Go to: Me' },
		{ type: 'tab', id: 'stories', title: 'Go to: Stories' },
		{ type: 'tab', id: 'journal', title: 'Go to: Journal' },
		{ type: 'tab', id: 'book', title: 'Go to: My Book' },
		{ type: 'tab', id: 'cv', title: 'Go to: CV' },
		...journalEntries.map((e: { id: string; title: string }) => ({
			type: 'journal',
			id: e.id,
			title: `Open entry: ${e.title}`
		}))
	]);

	const filtered = $derived(
		query.trim()
			? commands.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
			: commands
	);

	function focusTrap(e: KeyboardEvent) {
		if (e.key !== 'Tab' || !modalEl) return;
		const focusables = Array.from(
			modalEl.querySelectorAll<HTMLElement>(
				'a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])'
			)
		).filter((el) => !el.hasAttribute('disabled'));
		if (!focusables.length) return;
		const first = focusables[0];
		const last = focusables[focusables.length - 1];
		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	}

	function open() {
		isOpen = true;
		query = '';
		activeIndex = 0;
		previouslyFocused = document.activeElement;
		setTimeout(() => {
			const el = document.getElementById('cmdk-input') as HTMLInputElement | null;
			el?.focus();
		}, 0);
	}

	function close() {
		isOpen = false;
		if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
	}

	function onGlobalKeydown(e: KeyboardEvent) {
		const cmdOrCtrl = e.metaKey || e.ctrlKey;
		if (cmdOrCtrl && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			isOpen ? close() : open();
		}
		if (isOpen && e.key === 'Escape') {
			close();
		}
	}

	onMount(() => {
		window.addEventListener('keydown', onGlobalKeydown as (ev: Event) => void);
		return () => {
			window.removeEventListener('keydown', onGlobalKeydown as (ev: Event) => void);
		};
	});

	function move(delta: number) {
		if (!filtered.length) return;
		activeIndex = (activeIndex + delta + filtered.length) % filtered.length;
	}

	function submit(item?: (typeof filtered)[number]) {
		const target = item ?? filtered[activeIndex];
		if (!target) return;
		if (target.type === 'tab') {
			navigateToTab(target.id as any);
		} else if (target.type === 'journal') {
			openJournal(target.id);
		}
		close();
	}
</script>

{#if isOpen}
	<!-- Overlay -->
	<div class="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" onclick={close}></div>
	<div
		bind:this={modalEl}
		class="fixed top-10 left-1/2 w-[min(680px,92vw)] -translate-x-1/2 rounded-2xl border border-white/10 bg-black/80 p-3 shadow-xl"
		role="dialog"
		aria-modal="true"
		aria-labelledby="cmdk-title"
		tabindex="-1"
		onkeydown={focusTrap}
	>
		<h2 id="cmdk-title" class="sr-only">Command palette</h2>
		<div class="flex items-center gap-2 rounded-lg border border-white/10 bg-black/60 px-3 py-2">
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				class="text-white/60"
				><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg
			>
			<input
				id="cmdk-input"
				class="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
				placeholder="Search (tabs, journal entries)..."
				bind:value={query}
				onkeydown={(e: KeyboardEvent) => {
					if (e.key === 'ArrowDown') {
						e.preventDefault();
						move(1);
					}
					if (e.key === 'ArrowUp') {
						e.preventDefault();
						move(-1);
					}
					if (e.key === 'Enter') {
						e.preventDefault();
						submit();
					}
				}}
			/>
			<div class="text-[10px] text-white/40">⌘K</div>
		</div>
		<div class="mt-3 max-h-[50vh] overflow-y-auto rounded-lg border border-white/10">
			{#if filtered.length === 0}
				<div class="px-4 py-6 text-center text-sm text-white/60">No results</div>
			{:else}
				<ul>
					{#each filtered as item, i}
						<li>
							<button
								class="w-full px-4 py-2 text-left text-sm transition-colors {i === activeIndex
									? 'bg-white/10 text-white'
									: 'text-white/80 hover:bg-white/5'}"
								onclick={() => submit(item)}
							>
								{item.title}
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
{/if}
