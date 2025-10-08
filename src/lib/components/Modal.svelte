<script lang="ts">
	let {
		open,
		content = '',
		onClose
	}: {
		open: boolean;
		content?: string;
		onClose: () => void;
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
	<div class="fixed inset-0 z-50 grid place-items-center" role="presentation">
		<button
			type="button"
			class="absolute inset-0 z-0 bg-black/70"
			aria-label="Close modal"
			onclick={onClose}
		></button>
		<div
			class="relative z-10 m-4 h-[70vh] w-[min(94vw,42rem)] overflow-hidden bg-white p-0 shadow-[0_8px_0_0_rgb(0,0,0)] ring-1 ring-black"
			role="dialog"
			aria-modal="true"
			tabindex="-1"
			bind:this={dialogEl}
		>
			<div class="flex items-center justify-end bg-white px-4 py-2">
				<button
					class="inline-flex items-center justify-center rounded p-1 hover:bg-black/5"
					aria-label="Close"
					onclick={onClose}
				>
					✕
				</button>
			</div>
			<div class="poem h-[calc(70vh-40px)] overflow-auto p-4 text-base leading-relaxed">
				{content}
			</div>
		</div>
	</div>
{/if}
