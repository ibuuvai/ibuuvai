<script lang="ts">
	const props = $props<{
		text: string;
	}>();
</script>

<blockquote class="border-accent my-8 border-l-4 pl-4 italic">
	{props.text}
</blockquote>
