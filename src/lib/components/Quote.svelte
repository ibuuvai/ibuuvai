<script lang="ts">
  const props = $props<{
    text: string;
  }>();
</script>

<blockquote class="pl-4 my-8 italic border-l-4 border-accent">
  {props.text}
</blockquote> 