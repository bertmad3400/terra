<script>
	import '../app.css';
</script>

<svelte:head>
	<title>Terra Mystica Timer</title>
	<meta property="og:title" content="Terra Mystica Timer" />
	<meta
		property="og:description"
		content="Ever wondered who is the slowest at Terra Mystica? Well, wonder no more..."
	/>
	<meta property="og:image" content="https://terra-timer.vercel.app/og-image.png" />
	<meta property="og:type" content="website" />
</svelte:head>

<slot />

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.black);
	}

	:global(body) {
		@apply h-screen w-screen;
	}
</style>
