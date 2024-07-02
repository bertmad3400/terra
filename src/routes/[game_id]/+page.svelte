<script lang="ts">
	import type { PageData } from './$types';
	import type { GameState } from '$lib/types';

	import { players, running } from '$lib/state';
	import { endRound, tick } from '$lib/state/modify';
	import { getGridSize } from '$lib/common';
	import { onMount } from 'svelte';

	import UserTimer from './userTimer.svelte';
	import Controls from './controls.svelte';
	import Sidebar from './sidebar/index.svelte';

	export let data: PageData;

	$: [cols, rows] = getGridSize($players);

	function save() {
		if (!$running) return;

		const newGameState: GameState = {
			id: data.game.id,
			start: data.game.start,
			end: new Date().toISOString(),
			players: $players
		};

		localStorage.setItem(data.game.id, JSON.stringify(newGameState));
	}

	onMount(() => {
		players.set(data.game.players);
		endRound();

		const intervals = [setInterval(() => tick($running), 1000), setInterval(save, 5000)];

		return () => intervals.forEach((interval) => clearInterval(interval));
	});
</script>

<main class="relative h-full flex">
	<Sidebar game={data.game} />
	<section
		style="grid-template: repeat({rows}, 1fr) / repeat({cols}, 1fr);"
		class="relative grid h-full grow p-4 {$running ? '' : 'saturate-50'} transition-all"
	>
		<Controls {running} />
		{#each $players as player}
			<UserTimer {player} running={$running} />
		{/each}
	</section>
</main>
