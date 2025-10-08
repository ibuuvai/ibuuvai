<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	let { children } = $props();
	let previousImage = '';

    // Visual viewport fallback for iOS 26 / WKWebView
    function setVH() {
        const h = (window.visualViewport?.height || window.outerHeight || window.innerHeight) * 0.01;
        document.documentElement.style.setProperty('--vh', `${h}px`);
    }

    $effect(() => {
        setVH();
        window.addEventListener('resize', setVH);
        return () => window.removeEventListener('resize', setVH);
    });

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

<div class="page-layer">
	<div id="bg-fader" class="bg-fader"></div>
	{@render children()}
</div>
<div class="ios-bottom-guard"></div>
