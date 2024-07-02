<script lang="ts">
	import { page } from '$app/stores';

	$: title = $page.error?.title ?? `${$page.status}: ${$page.error?.message}`;
</script>

<main class="h-full flex flex-col gap-4 items-center justify-center">
	<h1 class="font-bold text-8xl text-white">
		{title}
	</h1>
	{#if $page.error?.desc}
		<p class="text-4xl font-light text-white">{$page.error.desc}</p>
	{/if}
</main>
