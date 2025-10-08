<script lang="ts">
	let { title }: { title: string } = $props();
</script>

<header class="relative mt-0 mb-0">
    <div class="manga-panel h-16" style="border-radius: var(--radius)">
        <div class="dot-bg h-full w-full" style="border-radius: var(--radius)"></div>
    </div>
    <div class="pointer-events-none absolute inset-0 grid place-items-center">
        <span
            class="border-2 border-black bg-white px-5 py-2 text-lg font-semibold tracking-wide lowercase"
            style="border-radius: var(--radius)"
        >
            {title}
        </span>
    </div>
</header>
