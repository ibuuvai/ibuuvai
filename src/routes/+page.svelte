<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import CommandPalette from '$lib/components/CommandPalette.svelte';
	import { journalEntries } from '$lib/content/journal';
	import { bookChapters } from '$lib/content/book';
	import JournalList from '$lib/components/JournalList.svelte';
	import BookReader from '$lib/components/BookReader.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Tabs from '$lib/components/Tabs.svelte';

	// Tab state management
	let selectedTab = $state<'stories' | 'journal' | 'about' | 'book'>('about');
	let mounted = $state(false);
	let currentChapter = $state(0);
	let bookProgress = $state(0);
	let lastChapter = $state(0);
	// removed unused: turnDirection

	// Journal entries state
	let openJournalEntry = $state<string | null>(null);
	let isStoryVisible = $state(false);

	// removed unused: typingAnimationDuration

	// Cursor parallax state (CSS variables driven)
	let enableMotion = $state(true);

	// Mount handler
	onMount(() => {
		mounted = true;

		// Open journal entry from URL hash and switch to journal tab if applicable
		const openFromHash = () => {
			const id = location.hash.replace(/^#/, '');
			if (!id) return;
			const exists = journalEntries.some((e) => e.id === id);
			if (exists) {
				selectedTab = 'journal';
				openJournalEntry = id;
				setTimeout(() => {
					const entryElement = document.getElementById(`entry-${id}`);
					entryElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}, 50);
			}
		};

		openFromHash();
		const onHash = () => openFromHash();
		window.addEventListener('hashchange', onHash);

		// Scroll reveal animations for elements marked with [data-reveal]
		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						entry.target.classList.add('animate-slide-up');
						io.unobserve(entry.target);
					}
				}
			},
			{ root: null, threshold: 0.15 }
		);
		Array.from(document.querySelectorAll('[data-reveal]')).forEach((el) => io.observe(el));

		// Reduced motion check
		const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
		enableMotion = !prefersReduced.matches;
		const onReducedChange = () => (enableMotion = !prefersReduced.matches);
		prefersReduced.addEventListener?.('change', onReducedChange);

		// Cursor parallax: update CSS variables --mx/--my (normalized) and --cursor-x/--cursor-y (px)
		const onMouseMove = (e: MouseEvent) => {
			if (!enableMotion) return;
			const cx = window.innerWidth / 2;
			const cy = window.innerHeight / 2;
			const mx = (e.clientX - cx) / cx; // -1..1
			const my = (e.clientY - cy) / cy; // -1..1
			document.documentElement.style.setProperty('--mx', String(mx));
			document.documentElement.style.setProperty('--my', String(my));
			document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px');
			document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px');
		};
		window.addEventListener('mousemove', onMouseMove, { passive: true });

		function clamp(n: number, min: number, max: number) {
			return Math.max(min, Math.min(max, n));
		}

		function updateBookProgress() {
			const container = document.querySelector(
				'.book-container .chapter-content'
			) as HTMLElement | null;
			if (!container) {
				bookProgress = 0;
				return;
			}
			const elTop = container.getBoundingClientRect().top + window.scrollY;
			const elHeight = container.offsetHeight;
			const viewport = window.innerHeight;
			const maxScroll = Math.max(1, elHeight - viewport);
			const raw = (window.scrollY - elTop) / maxScroll;
			bookProgress = clamp(raw, 0, 1);
		}

		const onScroll = () => updateBookProgress();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		updateBookProgress();

		return () => {
			window.removeEventListener('hashchange', onHash);
			window.removeEventListener('scroll', onScroll as EventListener);
			window.removeEventListener('resize', onScroll as EventListener);
			window.removeEventListener('mousemove', onMouseMove as EventListener);
			io.disconnect();
		};
	});

	$effect(() => {
		// Trigger progress update when switching to book or changing chapter
		selectedTab;
		currentChapter;
		setTimeout(() => {
			if (selectedTab === 'book') {
				const container = document.querySelector('.book-container .chapter-content');
				if (container) {
					bookProgress = 0;
					// delay to allow layout to settle
					setTimeout(() => {
						const evt = new Event('scroll');
						window.dispatchEvent(evt);
					}, 0);
				}
			}
		}, 0);

		if (currentChapter !== lastChapter) {
			lastChapter = currentChapter;
		}
	});

	function selectTab(tab: 'stories' | 'journal' | 'about' | 'book') {
		const apply = () => {
			selectedTab = tab;
			if (tab !== 'journal' && typeof window !== 'undefined' && location.hash) {
				try {
					history.replaceState(null, '', location.pathname + location.search);
				} catch {}
			}
		};
		if (document.startViewTransition) {
			document.startViewTransition(apply);
		} else {
			apply();
		}
	}

	function navigateToTab(tab: 'stories' | 'journal' | 'about' | 'book') {
		selectTab(tab);
	}

	function openJournalFromPalette(id: string) {
		selectedTab = 'journal';
		openJournalEntry = id;
		setTimeout(() => {
			const entryElement = document.getElementById(`entry-${id}`);
			entryElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}, 50);
	}

	function toggleJournalEntry(id: string) {
		const next = openJournalEntry === id ? null : id;
		openJournalEntry = next;
		// Update hash without causing jump when closing
		if (next) {
			location.hash = `#${id}`;
			setTimeout(() => {
				const entryElement = document.getElementById(`entry-${id}`);
				entryElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}, 50);
		} else if (location.hash === `#${id}`) {
			history.replaceState(null, '', location.pathname + location.search);
		}
	}

	function toggleStory() {
		isStoryVisible = !isStoryVisible;
	}

	async function goToChapter(i: number) {
		currentChapter = Math.max(0, Math.min(bookChapters.length - 1, i));
		await tick();
		// trigger progress recalculation and scroll into view
		window.dispatchEvent(new Event('scroll'));
		document
			.querySelector('.book-container')
			?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	// Journal entries data moved to $lib/content/journal

	// Book content moved to $lib/content/book
</script>

<svelte:head>
	<title>ibuuvai</title>
	<meta
		name="description"
		content="A digital narrative exploring existence, isolation, and the search for meaning."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Cutive+Mono&family=Major+Mono+Display&display=swap"
		rel="stylesheet"
	/>

	<style>
		@keyframes typing {
			from {
				width: 0;
			}
			to {
				width: 100%;
			}
		}

		@keyframes blink-caret {
			from,
			to {
				border-color: transparent;
			}
			50% {
				border-color: #fff;
			}
		}

		@keyframes blink-caret-end {
			0%,
			79% {
				border-color: transparent;
			}
			30%,
			49% {
				border-color: #fff;
			}
			80%,
			100% {
				border-color: transparent;
			}
		}

		@keyframes typing-line2 {
			0% {
				width: 0;
			}
			50% {
				width: 0;
			}
			100% {
				width: 100%;
			}
		}

		.main-phrase {
			font-size: 1.125rem;
			line-height: 1.5;
		}

		.typing-animation-text {
			display: inline-block;
			overflow: hidden;
			white-space: nowrap;
			width: 0;
			border-right: 3px solid transparent;
			animation:
				typing 1.5s steps(20, end) forwards,
				blink-caret 0.75s step-end 4;
		}

		.typing-animation-text-line2 {
			display: inline-block;
			overflow: hidden;
			white-space: nowrap;
			width: 0;
			border-right: 3px solid #fff;
			animation:
				typing-line2 3s steps(40, end) forwards,
				blink-caret 0.75s step-end 6 1.5s,
				cursor-disappear 0.1s forwards 6s;
		}

		@keyframes cursor-disappear {
			to {
				border-right-color: transparent;
			}
		}

		@media (max-width: 640px) {
			.main-phrase {
				font-size: 0.875rem;
			}

			.typing-animation-text,
			.typing-animation-text-line2 {
				max-width: 90vw;
			}
		}

		/* Custom scrollbar styling */
		.custom-scrollbar::-webkit-scrollbar {
			width: 6px;
		}

		.custom-scrollbar::-webkit-scrollbar-track {
			background: rgba(0, 0, 0, 0.2);
			border-radius: 10px;
			margin: 10px 0;
			border: 1px solid rgba(128, 90, 213, 0.05);
		}

		.custom-scrollbar::-webkit-scrollbar-thumb {
			background: linear-gradient(180deg, rgba(161, 90, 213, 0.6), rgba(128, 90, 213, 0.8));
			border-radius: 10px;
			box-shadow: 0 0 8px rgba(161, 90, 213, 0.3);
			transition: all 0.3s ease;
		}

		.custom-scrollbar::-webkit-scrollbar-thumb:hover {
			background: linear-gradient(180deg, rgba(161, 90, 213, 0.8), rgba(128, 90, 213, 1));
			box-shadow: 0 0 15px rgba(161, 90, 213, 0.5);
		}

		.custom-scrollbar {
			scrollbar-width: thin;
			scrollbar-color: rgba(161, 90, 213, 0.7) rgba(0, 0, 0, 0.2);
			padding-right: 5px;
		}

		.warning-content {
			opacity: 0;
			animation: glitchIn 1.2s forwards;
			animation-delay: 3.2s;
		}

		@keyframes glitchIn {
			0% {
				opacity: 0;
				transform: translateX(-10px) skewX(20deg);
				text-shadow: -2px 0 #ff0000;
				clip-path: inset(0 100% 0 0);
			}
			10% {
				opacity: 0.3;
				transform: translateX(5px) skewX(-10deg);
				text-shadow: 2px 0 #00ff00;
				clip-path: inset(0 80% 0 0);
			}
			20% {
				opacity: 0.5;
				transform: translateX(-3px) skewX(5deg);
				text-shadow:
					-1px 0 #ff0000,
					1px 0 #00ff00;
				clip-path: inset(0 60% 0 0);
			}
			30% {
				opacity: 0.7;
				transform: translateX(2px) skewX(-3deg);
				text-shadow:
					1px 0 #0000ff,
					-1px 0 #ff0000;
				clip-path: inset(0 40% 0 0);
			}
			40% {
				opacity: 0.8;
				transform: translateX(-1px) skewX(1deg);
				text-shadow:
					-1px 0 #00ff00,
					1px 0 #0000ff;
				clip-path: inset(0 20% 0 0);
			}
			50% {
				opacity: 1;
				transform: translateX(0) skewX(0);
				text-shadow:
					1px 0 #ff0000,
					-1px 0 #00ff00;
				clip-path: inset(0 0 0 0);
			}
			60%,
			70% {
				opacity: 1;
				transform: skewX(2deg) translateX(3px);
				text-shadow:
					-1px 0 #ff0000,
					2px 2px #00ff00;
			}
			80%,
			90% {
				opacity: 1;
				transform: skewX(-2deg) translateX(-3px);
				text-shadow:
					1px 0 #ff0000,
					-2px -2px #00ff00;
			}
			100% {
				opacity: 1;
				transform: skewX(0) translateX(0);
				text-shadow: none;
			}
		}

		/* Continuous glitch effect */
		@keyframes glitch {
			0% {
				transform: translate(0);
				text-shadow:
					-1px 0 red,
					1px 0 blue;
			}
			2% {
				transform: translate(-2px, 1px);
				text-shadow:
					1px 0 red,
					-1px 0 blue;
			}
			4% {
				transform: translate(-2px, -2px);
				text-shadow:
					1px 0 green,
					-1px 0 red;
			}
			6% {
				transform: translate(0);
				text-shadow:
					-1px 0 red,
					1px 0 green;
			}
			8% {
				transform: translate(0, 1px);
				text-shadow:
					-1px 0 blue,
					1px 0 red;
			}
			10% {
				transform: translate(0);
				text-shadow:
					-1px 0 red,
					1px 0 blue;
			}
			45% {
				transform: translate(0);
				text-shadow:
					-1px 0 red,
					1px 0 blue;
			}
			46% {
				transform: translateX(3px);
				text-shadow:
					-1px 0 blue,
					1px 0 red;
			}
			48% {
				transform: translateX(-3px);
				text-shadow:
					1px 0 red,
					-1px 0 green;
			}
			50% {
				transform: translateX(0);
				text-shadow:
					-1px 0 red,
					1px 0 blue;
			}
			100% {
				transform: translateX(0);
				text-shadow:
					-1px 0 red,
					1px 0 blue;
			}
		}

		.animate-glitch {
			animation: glitch 4s infinite;
			animation-delay: 4.4s; /* Start after glitchIn finishes */
		}

		.warning-text-1 {
			opacity: 0;
			animation: fadeIn 0.8s ease-out forwards;
			animation-delay: 3.8s;
		}

		.warning-text-2 {
			opacity: 0;
			animation: fadeIn 0.8s ease-out forwards;
			animation-delay: 4.4s;
		}

		.stay-away {
			opacity: 0;
			animation:
				fadeIn 0.8s ease-out forwards,
				enhancedPulse 2s infinite;
			animation-delay: 5s, 5.8s; /* First delay for fadeIn, second for pulse */
			transform-origin: center;
			display: inline-block;
		}

		.blood-drops {
			opacity: 0;
			animation: fadeIn 0.5s ease-out forwards;
			animation-delay: 5.6s;
		}

		.drop-1 {
			animation: fallRepeat 2.5s ease-in infinite;
			animation-delay: 5.8s;
			opacity: 0;
		}

		.drop-2 {
			animation: fallRepeat 3s ease-in infinite;
			animation-delay: 6.2s;
			opacity: 0;
		}

		.drop-3 {
			animation: fallRepeat 2.8s ease-in infinite;
			animation-delay: 6.6s;
			opacity: 0;
		}

		@keyframes fadeIn {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}

		@keyframes pulse {
			0% {
				opacity: 0.8;
				color: #8b0000;
				text-shadow: 0 0 3px #8b0000;
			}
			50% {
				opacity: 1;
				color: #ff0000;
				text-shadow: 0 0 8px #ff0000;
			}
			100% {
				opacity: 0.8;
				color: #8b0000;
				text-shadow: 0 0 3px #8b0000;
			}
		}

		@keyframes enhancedPulse {
			0% {
				transform: scale(1);
				color: #8b0000;
				text-shadow: 0 0 4px #8b0000;
				filter: brightness(0.9);
			}
			50% {
				transform: scale(1.15);
				color: #ff0000;
				text-shadow:
					0 0 10px #ff0000,
					0 0 15px #ff3333,
					0 0 20px #ff6666;
				filter: brightness(1.2);
			}
			100% {
				transform: scale(1);
				color: #8b0000;
				text-shadow: 0 0 4px #8b0000;
				filter: brightness(0.9);
			}
		}

		@keyframes fall {
			from {
				transform: translateY(0);
			}
			to {
				transform: translateY(100px);
			}
		}

		@keyframes fallRepeat {
			0% {
				transform: translateY(0);
				opacity: 1;
			}
			80% {
				transform: translateY(100px);
				opacity: 1;
			}
			81% {
				opacity: 0;
			}
			82% {
				transform: translateY(0);
				opacity: 0;
			}
			100% {
				transform: translateY(0);
				opacity: 1;
			}
		}

		.page-turn {
			transition: transform 0.5s ease;
		}

		.turn-forward {
			transform: translateX(100%);
		}

		.turn-back {
			transform: translateX(-100%);
		}
	</style>
</svelte:head>

<main class="bg-primary relative flex min-h-screen flex-col justify-start overflow-hidden">
	<!-- Background and main container -->
	<div class="flex flex-1 flex-col">
		{#if mounted}
			<div in:fade={{ duration: 1500, delay: 300 }} class="absolute inset-0">
				<div class="bg-primary absolute inset-0 opacity-90"></div>

				<!-- Background glow - positioned to cover the entire page -->
				<div
					class="bg-accent/8 pointer-events-none fixed top-1/2 left-1/2 h-[70rem] w-[70rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[60px]"
				></div>
			</div>

			<!-- Hero Content - Takes full viewport height -->
			<Hero />

				<!-- Command Palette -->
				<CommandPalette
					journalEntries={journalEntries.map(({ id, title }) => ({ id, title }))}
					{navigateToTab}
					openJournal={openJournalFromPalette}
				/>

			<!-- Tabbed Content Area - Positioned below initial viewport -->
			<div class="relative min-h-screen pt-16">
				<!-- Tab Navigation -->
				<Tabs selectedTab={selectedTab} onSelect={selectTab} />
				<!-- Tab Content -->
				<div class="mx-auto w-full max-w-3xl p-2 px-3 md:p-4 md:px-6">
					{#if selectedTab === 'stories'}
						<div in:fade={{ duration: 300 }} class="text-center">
							<h3 class="font-handwriting text-accent mb-4 text-xl">Featured Story</h3>
							<ul class="space-y-3">
								<li class="border-accent/10 border-b pb-2" data-reveal>
									<button
										onclick={toggleStory}
										class="hover:text-accent group relative flex w-full items-center py-2 text-left text-white transition-colors"
									>
										<span class="mr-2 inline-block h-4 w-4 flex-shrink-0">
											{#if isStoryVisible}
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
													class="text-accent h-4 w-4"
												>
													<path d="M6 9l6 6 6-6" />
												</svg>
											{:else}
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
													class="group-hover:text-accent/70 h-4 w-4 text-white/50"
												>
													<path d="M9 18l6-6-6-6" />
												</svg>
											{/if}
										</span>
										<span
											class="font-handwriting group-hover:text-accent text-base transition-colors {isStoryVisible
												? 'text-accent'
												: ''}">Nontitled</span
										>
										<span class="ml-2 text-xs text-white">2023</span>
									</button>

									{#if isStoryVisible}
										<div
											in:slide={{ duration: 300 }}
											class="border-accent/20 font-handwriting mt-3 border-l-2 pr-2 pl-4 text-left text-sm leading-relaxed whitespace-pre-line text-white"
										>
											<p>
												Loneliness and love are foreign concepts, distant and incomprehensible, our
												human forms already cast aside, discarded long ago. Proof of existence is
												reduced to empty words, scattered meaningless across a cramped, suffocating
												stage. We are performers without an audience, each desperately acting out
												our roles, running breathlessly towards the end credits, even though the
												seats remain vacant.
											</p>

											<p class="mt-2">
												The person I once recognized as myself is no longer here, lost somewhere
												beyond memory. I can't recall a single part I was suited to play. Now, the
												encore has arrived—surely, we are all holding our breath, waiting for the
												dramatic twist. Yet, what do those eyes of yours see? There was a time when
												we were innocent, untouched; but before we realized it, we had turned into
												monsters.
											</p>

											<p class="mt-2">
												Without warning, I became nothing more than a side character, my voice lost
												amidst overwhelming noise. Everyone around desperately shields themselves,
												secretly yearning for a savior's hand to appear. Alone, I shed tears, unable
												to find the truths I had carefully hidden. Looking back, hadn't I discarded
												every emotion? Yet, the tears still flowed inexplicably. Warmth and kindness
												seem suspicious now, every offered hand is mistrusted. Love seeps slowly
												from the wound in my heart, and your gaze threatens my collapse. How pitiful
												I must appear, caught dancing precariously between love and hatred.
											</p>

											<p class="mt-2">
												Enough—I long for ignorance now. Words have become meaningless.
											</p>

											<div class="border-accent/30 my-4 border-l-4 bg-black/20 px-4 py-2 italic">
												"Hey, let's run away to somewhere far away—a place that's not here."
											</div>

											<p class="mt-2">
												A place where the morning dawn gently spills through the wooden cracks,
												illuminating a forgotten path once caressed by winds beneath an eternal
												springtime sky. A place free of scripts, devoid of lines or directors, where
												every moment is fleeting, impossible to retake. A world beyond the frame of
												any camera, a reality untouched even by the widest of lenses. In this hidden
												place, we could taste suspiciously bright fruits without fear of judgment.
											</p>

											<p class="mt-2">
												No one would cry for us. The title flashing across the screen just before
												the end—a story unremembered, incredibly ordinary. This title, abandoned
												like refuse, without even the dignity of a name, belongs solely to you and
												me.
											</p>
										</div>
									{/if}
								</li>
							</ul>
						</div>
					{:else if selectedTab === 'journal'}
						<div in:fade={{ duration: 300 }}>
							<h3 class="font-handwriting text-accent mb-4 text-center text-xl">Recent Entries</h3>
							<JournalList
								entries={journalEntries}
								openId={openJournalEntry}
								onToggle={toggleJournalEntry}
							/>
						</div>
					{:else if selectedTab === 'book'}
						<div in:fade={{ duration: 300 }} class="flex flex-col items-center">
							<div class="mx-auto w-full max-w-3xl">
								<BookReader {currentChapter} chapters={bookChapters} {goToChapter} />
							</div>
						</div>
					{:else if selectedTab === 'about'}
						<div in:fade={{ duration: 300 }} class="flex flex-col items-center">
							<div class="mx-auto mb-8 w-full max-w-3xl">
								<!-- Main profile section with image and name -->
								<div class="relative mb-8">
									<div
										class="border-accent/20 relative flex flex-col items-center overflow-hidden rounded-2xl border bg-black/40 backdrop-blur-sm md:flex-row"
										data-reveal
									>
										<div class="flex flex-shrink-0 flex-col items-center p-6 md:items-start md:p-8">
											<img
												src="/images/ibuuvai.webp"
												alt="Vai Ibuu"
												class="shadow-accent/10 mb-4 h-72 w-72 shadow-lg md:h-80 md:w-80"
												width="320"
												height="320"
												loading="lazy"
												onerror={(e) => {
													(e.currentTarget as HTMLImageElement).src =
														'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22320%22 height=%22320%22%3E%3Crect width=%22100%25%22 height=%22100%25%22 fill=%22%23000%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 fill=%22%23fff%22 font-size=%2212%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3Eimage%3C/text%3E%3C/svg%3E';
												}}
											/>
										</div>

										<div class="flex-grow p-6 md:p-8">
											<!-- Stats cards -->
											<div class="mb-6 grid grid-cols-2 gap-3">
												<div
													class="border-accent/10 flex flex-col items-center justify-center rounded-xl border bg-black/30 p-4"
												>
													<span class="text-accent text-2xl font-bold">vai</span>
													<span class="text-xs tracking-wider text-white/60 uppercase">name</span>
												</div>

												<div
													class="border-accent/10 flex flex-col items-center justify-center rounded-xl border bg-black/30 p-4"
												>
													<span class="text-accent text-2xl font-bold">22</span>
													<span class="text-xs tracking-wider text-white/60 uppercase">age</span>
												</div>
											</div>

											<div
												class="border-accent/10 mb-4 rounded-xl border bg-black/30 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:bg-black/40"
											>
												<div class="text-accent mb-3 text-center text-sm font-bold tracking-wider uppercase">
													Loves
												</div>
												<div class="flex flex-wrap justify-center gap-2">
													<span
														class="bg-accent/10 text-accent/90 font-handwriting hover:bg-accent/20 rounded-full px-3 py-1.5 text-xs transition-all duration-300"
													>
														Afternoon Nap
													</span>
													<span
														class="bg-accent/10 text-accent/90 font-handwriting hover:bg-accent/20 rounded-full px-3 py-1.5 text-xs transition-all duration-300"
													>
														Reading
													</span>
												</div>
											</div>

											<div class="mb-4 flex flex-col items-center space-y-3">
												<div
													class="custom-scrollbar flex h-64 w-full flex-col items-center space-y-3 overflow-y-auto pr-2"
												>
													<div
														class="border-accent/10 w-64 rounded-xl border bg-black/30 px-4 py-3 text-center backdrop-blur-sm transition-all duration-300 hover:bg-black/40"
													>
														<div class="mb-1 font-mono text-sm text-purple-400">Height</div>
														<div class="font-handwriting text-white">185cm (6'3)</div>
													</div>

													<div
														class="border-accent/10 w-64 rounded-xl border bg-black/30 px-4 py-3 text-center backdrop-blur-sm transition-all duration-300 hover:bg-black/40"
													>
														<div class="mb-1 font-mono text-sm text-purple-400">Birthday</div>
														<div class="font-handwriting text-white">31st July</div>
													</div>

													<div
														class="border-accent/10 w-64 rounded-xl border bg-black/30 px-4 py-3 text-center backdrop-blur-sm transition-all duration-300 hover:bg-black/40"
													>
														<div class="mb-1 font-mono text-sm text-purple-400">Zodiac Sign</div>
														<div class="font-handwriting text-white">Leo</div>
													</div>

													<div
														class="border-accent/10 w-64 rounded-xl border bg-black/30 px-4 py-3 text-center backdrop-blur-sm transition-all duration-300 hover:bg-black/40"
													>
														<div class="mb-1 font-mono text-sm text-purple-400">Favorite Food</div>
														<div class="font-handwriting text-white">Salmon Sushi</div>
													</div>

													<div
														class="border-accent/10 w-64 rounded-xl border bg-black/30 px-4 py-3 text-center backdrop-blur-sm transition-all duration-300 hover:bg-black/40"
													>
														<div class="mb-1 font-mono text-sm text-purple-400">Favorite Pet</div>
														<div class="font-handwriting text-white">White Cat</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div
									class="border-accent/20 mt-6 rounded-2xl border bg-black/30 p-4 md:p-6"
									data-reveal
								>
									<div class="mb-4 flex items-center justify-between">
										<h3 class="text-accent font-handwriting text-lg">Curriculum Vae Victis</h3>
										<span
											class="border-accent/20 bg-accent/10 text-accent/90 rounded-full border px-2 py-1 text-[10px] tracking-wide uppercase"
											>not for employment; for evidence</span
										>
									</div>

									<div class="font-handwriting space-y-6">
										<section>
											<h4
												class="font-handwriting mb-1 text-xs tracking-wider text-white/90 uppercase"
											>
												Profile
											</h4>
											<p class="font-handwriting leading-relaxed text-white/80">
												Born of bad timing; domesticated by poems. I collect exits, broken promises,
												and sentences that refuse to behave. If there is a way to love incorrectly,
												I have documented it with care.
											</p>
										</section>

										<section>
											<h4
												class="font-handwriting mb-2 text-xs tracking-wider text-white/90 uppercase"
											>
												Selected Works
											</h4>
											<ul class="grid grid-cols-1 gap-2 md:grid-cols-2">
												<li
													class="border-accent/10 rounded-lg border bg-black/20 px-3 py-2 text-white/80"
												>
													<span class="font-handwriting">a letter that will never reach you</span
													><span class="text-white/50"> — endurance, performed badly.</span>
												</li>
												<li
													class="border-accent/10 rounded-lg border bg-black/20 px-3 py-2 text-white/80"
												>
													<span class="font-handwriting">The silent collapse of a heart</span><span
														class="text-white/50"
													>
														— a study in exquisite damage.</span
													>
												</li>
												<li
													class="border-accent/10 rounded-lg border bg-black/20 px-3 py-2 text-white/80 md:col-span-2"
												>
													<span class="font-handwriting">at the mercy of my dreams</span><span
														class="text-white/50"
													>
														— field notes from a beautiful failure.</span
													>
												</li>
											</ul>
										</section>

										<section>
											<h4
												class="font-handwriting mb-2 text-xs tracking-wider text-white/90 uppercase"
											>
												Experience
											</h4>
											<ul class="space-y-2">
												<li class="border-accent/10 rounded-lg border bg-black/20 p-3">
													<div class="flex items-center justify-between text-white/90">
														<span class="font-handwriting">Amateur witness to my own life</span
														><span class="text-[10px] tracking-wide text-white/50 uppercase"
															>ongoing</span
														>
													</div>
													<p class="mt-1 text-sm text-white/70">
														watch; refuse rescue; remember too clearly.
													</p>
												</li>
												<li
													class="border-accent/10 rounded-lg border bg-black/20 p-3 text-white/80"
												>
													Co-conspirator with loneliness — delivered daily.
												</li>
												<li
													class="border-accent/10 rounded-lg border bg-black/20 p-3 text-white/80"
												>
													Keeper of an unnecessary book — still writing it.
												</li>
											</ul>
										</section>

										<section>
											<h4
												class="font-handwriting mb-2 text-xs tracking-wider text-white/90 uppercase"
											>
												Competencies
											</h4>
											<div class="flex flex-wrap gap-2">
												<span class="bg-accent/10 text-accent/90 rounded-full px-3 py-1 text-xs"
													>Precision melancholy</span
												>
												<span class="bg-accent/10 text-accent/90 rounded-full px-3 py-1 text-xs"
													>Sustainable doubt</span
												>
												<span class="bg-accent/10 text-accent/90 rounded-full px-3 py-1 text-xs"
													>Elegant retreat</span
												>
												<span class="bg-accent/10 text-accent/90 rounded-full px-3 py-1 text-xs"
													>Transmuting hurt</span
												>
												<span class="bg-accent/10 text-accent/90 rounded-full px-3 py-1 text-xs"
													>Distilling silence</span
												>
												<span class="bg-accent/10 text-accent/90 rounded-full px-3 py-1 text-xs"
													>Disappearing politely</span
												>
											</div>
										</section>

										<section>
											<h4
												class="font-handwriting mb-2 text-xs tracking-wider text-white/90 uppercase"
											>
												Achievements
											</h4>
											<ul class="list-disc space-y-1 pl-5 text-white/80">
												<li>
													Survived the days I said I wouldn't. <span class="text-white/50"
														>(several)</span
													>
												</li>
												<li>
													Remembered small details no one thought important, and kept them alive.
												</li>
												<li>Apologised to the future without disturbing the past.</li>
											</ul>
										</section>

										<section>
											<h4
												class="font-handwriting mb-2 text-xs tracking-wider text-white/90 uppercase"
											>
												References
											</h4>
											<p class="text-white/70">
												Denied, with affection. The relevant people are tired; let them rest.
											</p>
										</section>
									</div>

									<div class="mt-6 text-right">
										<span class="font-handwriting text-white/80">signed—</span>
										<span class="font-handwriting text-accent italic">vai</span>
									</div>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		{#if selectedTab === 'book'}
			<div class="pointer-events-none fixed top-0 right-0 left-0">
				<div class="h-[2px] bg-white/10">
					<div
						class="bg-accent h-[2px] transition-[width] duration-200"
						style="width: {Math.round(bookProgress * 100)}%"
					></div>
				</div>
			</div>
		{/if}
	</div>

	<!-- Cursor aura (subtle, pointer-events none) -->
	{#if enableMotion}
		<div
			class="pointer-events-none fixed"
			style="top: var(--cursor-y); left: var(--cursor-x); transform: translate(-50%, -50%);"
		>
			<div class="cursor-aura"></div>
		</div>
	{/if}
</main>
