<script lang="ts">
	const {
		currentChapter = 0,
		chapters = [],
		goToChapter
	} = $props<{
		currentChapter: number;
		chapters: Array<{ title: string; content: string }>;
		goToChapter: (n: number) => void;
	}>();
</script>

<div
	class="border-accent/20 book-container overflow-hidden rounded-2xl border bg-white"
	data-reveal
>
	<!-- Chapter Navigation -->
	<div class="border-accent/10 flex items-center justify-between border-b p-4">
		<button
			onclick={() => goToChapter(currentChapter - 1)}
			class="hover:text-accent px-4 py-2 text-black transition-colors disabled:cursor-not-allowed disabled:opacity-50"
			aria-label="Previous chapter"
			disabled={currentChapter === 0}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor"
				><path
					fill-rule="evenodd"
					d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
					clip-rule="evenodd"
				/></svg
			>
		</button>
		<span class="text-accent font-handwriting text-lg">{chapters[currentChapter]?.title}</span>
		<button
			onclick={() => goToChapter(currentChapter + 1)}
			class="hover:text-accent px-4 py-2 text-black transition-colors disabled:cursor-not-allowed disabled:opacity-50"
			aria-label="Next chapter"
			disabled={currentChapter === chapters.length - 1}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor"
				><path
					fill-rule="evenodd"
					d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
					clip-rule="evenodd"
				/></svg
			>
		</button>
	</div>

	<!-- Chapter Content -->
	<div class="chapter-content p-6 md:p-8">
		<div class="prose max-w-none">
			<div
				class="font-handwriting break-anywhere mx-auto max-w-[70ch] leading-relaxed whitespace-pre-line text-black"
			>
				{chapters[currentChapter]?.content}
			</div>
		</div>
	</div>

	<!-- Bottom Chapter Navigation -->
	<div class="border-accent/10 flex items-center justify-between border-t p-4">
		<button
			onclick={() => goToChapter(currentChapter - 1)}
			class="hover:text-accent px-4 py-2 text-black transition-colors disabled:cursor-not-allowed disabled:opacity-50"
			aria-label="Previous chapter"
			disabled={currentChapter === 0}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor"
				><path
					fill-rule="evenodd"
					d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
					clip-rule="evenodd"
				/></svg
			>
		</button>
		<span class="text-accent font-handwriting text-lg">{chapters[currentChapter]?.title}</span>
		<button
			onclick={() => goToChapter(currentChapter + 1)}
			class="hover:text-accent px-4 py-2 text-black transition-colors disabled:cursor-not-allowed disabled:opacity-50"
			aria-label="Next chapter"
			disabled={currentChapter === chapters.length - 1}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor"
				><path
					fill-rule="evenodd"
					d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
					clip-rule="evenodd"
				/></svg
			>
		</button>
	</div>
</div>
