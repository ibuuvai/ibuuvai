<script lang="ts">
	import type { Snippet } from 'svelte';
	let {
		open,
		content = '',
		onClose,
		children,
		bare = false
	}: {
		open: boolean;
		content?: string;
		onClose: () => void;
		children?: Snippet;
		bare?: boolean;
	} = $props();

	let dialogEl = $state<HTMLDivElement | null>(null);
	let previousActive: HTMLElement | null = null;

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
			return;
		}
		if (e.key === 'Tab' && dialogEl) {
			const focusables = dialogEl.querySelectorAll<HTMLElement>(
				'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
			);
			if (focusables.length === 0) return;
			const first = focusables[0];
			const last = focusables[focusables.length - 1];
			const active = document.activeElement as HTMLElement | null;
			if (!e.shiftKey && active === last) {
				e.preventDefault();
				first.focus();
			} else if (e.shiftKey && active === first) {
				e.preventDefault();
				last.focus();
			}
		}
	}

	$effect(() => {
		if (open) {
			previousActive = document.activeElement as HTMLElement | null;
			document.body.style.overflow = 'hidden';
			document.addEventListener('keydown', onKey, true);
			queueMicrotask(() => dialogEl?.focus());
		} else {
			document.body.style.overflow = '';
			document.removeEventListener('keydown', onKey, true);
			previousActive?.focus?.();
		}
	});
</script>

{#if open}
	<div class="fixed inset-0 z-[100] grid place-items-center p-4" role="presentation">
		<button
			type="button"
			class="absolute inset-0 z-0 bg-black/70"
			aria-label="Close modal"
			onclick={onClose}
		></button>
		<div
			class={bare
				? 'relative z-10 grid max-h-[90vh] w-[min(96vw,1100px)] place-items-center overflow-hidden outline-none'
				: 'manga-panel relative z-10 max-h-[80vh] w-[min(94vw,42rem)] overflow-auto bg-white outline-none'}
			style={bare ? '' : 'border-radius: var(--radius)'}
			role="dialog"
			aria-modal="true"
			tabindex="-1"
			bind:this={dialogEl}
		>
			{#if bare}
				<button
					class="absolute top-2 right-2 z-20 inline-flex items-center justify-center rounded bg-white/90 px-2 py-1 text-sm ring-1 ring-black hover:bg-white"
					aria-label="Close"
					onclick={onClose}
				>
					✕
				</button>
				{@render children?.()}
			{:else}
				<div class="flex items-center justify-end bg-white px-3 py-2">
					<button
						class="inline-flex items-center justify-center p-1 hover:bg-black/5"
						aria-label="Close"
						onclick={onClose}
					>
						✕
					</button>
				</div>
				{#if content}
					<div class="poem px-5 pb-5 text-base leading-relaxed">{content}</div>
				{/if}
				{#if children}
					<div class="px-5 pb-5">{@render children?.()}</div>
				{/if}
			{/if}
		</div>
	</div>
{/if}
