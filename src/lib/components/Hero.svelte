<script lang="ts">
	import { fade } from 'svelte/transition';
</script>

<!-- Hero Content - Takes full viewport height (structure preserved) -->
<div class="relative flex h-screen flex-col items-center justify-center pt-0">
	<div in:fade={{ duration: 1000, delay: 400 }} class="relative mx-auto max-w-4xl">
		<!-- Avatar and Name - No top margin -->
		<div in:fade={{ duration: 1200, delay: 500 }} class="flex flex-col items-center justify-center">
			<img
				src="/images/vai.webp"
				alt="Creator Avatar"
				class="animate-pulse-subtle mb-4 h-48 w-48"
				style="transform: translate3d(calc(var(--mx,0)*8px), calc(var(--my,0)*8px), 0)"
			/>
			<span
				class="text-accent animate-text-focus font-handwriting text-3xl font-black uppercase md:text-5xl"
				style="transform: translate3d(calc(var(--mx,0)*4px), calc(var(--my,0)*4px), 0)"
				>Ibuu Vai</span
			>
			<div class="mt-2 w-full px-3 text-center">
			<p class="font-handwriting main-phrase font-bold text-white uppercase">
					<span class="typing-animation-text">My existence isn't known</span><br
						class="sm:hidden"
					/>
					<span class="typing-animation-text-line2">by anybody else</span>
				</p>
			</div>
		</div>

		<!-- Keep Out and Warning - Now waiting for typing animation to complete -->
		<div class="mt-3 px-3 text-center">
			<div class="warning-content relative inline-block">
				<div class="absolute inset-0 -m-2 rounded-2xl bg-[#8B0000]/15 blur-[15px]"></div>
				<h1
					class="font-creepy animate-glitch relative mb-1 px-2 text-4xl font-black text-[#8B0000] md:text-7xl"
				>
					Keep out
				</h1>
			</div>

			<div class="relative">
				<p
				class="font-handwriting mx-auto mt-1 max-w-xl px-2 text-center text-base text-white md:text-2xl"
				>
					<span class="warning-text-1 block">So that I will not be fooled...</span>
					<span class="warning-text-2 mt-1 block">So that I won't drag you into this—</span>
				</p>

				<!-- Stay away with drops -->
				<div class="relative mt-1">
					<div class="stay-away">
						<span class="font-creepy text-lg font-bold text-[#8B0000] md:text-2xl">stay away</span>
					</div>

					<!-- Dots positioned directly below stay away -->
					<div class="blood-drops absolute top-full left-1/2 mt-1 w-8 -translate-x-1/2">
						<div class="relative h-24 w-full">
							<div class="drop-1 absolute top-0 left-3 h-2 w-2 rounded-full bg-[#8B0000]"></div>
							<div class="drop-2 absolute top-0 left-1 h-1.5 w-1.5 rounded-full bg-[#8B0000]"></div>
							<div class="drop-3 absolute top-0 left-5 h-1 w-1 rounded-full bg-[#8B0000]"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
