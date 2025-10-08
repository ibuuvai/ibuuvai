<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	let { children } = $props();
	let previousImage = '';

	$effect(() => {
		const pathname = $page.url.pathname;
		const imagePath = pathname.startsWith('/me') ? '/images/me.webp' : '/images/flower.webp';
		// Fade between backgrounds
		const root = document.documentElement;
		if (previousImage && previousImage !== imagePath) {
			const fader = document.querySelector<HTMLDivElement>('#bg-fader');
			if (fader) {
				fader.style.backgroundImage = `url('${previousImage}')`;
				fader.style.opacity = '1';
				// next frame switch var and fade out
				requestAnimationFrame(() => {
					root.style.setProperty('--bg-image', `url('${imagePath}')`);
					fader.style.opacity = '0';
				});
			} else {
				root.style.setProperty('--bg-image', `url('${imagePath}')`);
			}
		} else {
			root.style.setProperty('--bg-image', `url('${imagePath}')`);
		}
		previousImage = imagePath;
	});
</script>

<div id="bg-fader" class="bg-fader"></div>
<div class="page-layer">
	{@render children()}
</div>
