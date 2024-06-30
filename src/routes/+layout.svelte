<script>
	import '../app.css';
</script>

<slot />

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.black);
	}

	:global(body) {
		@apply h-screen w-screen;
	}
</style>
