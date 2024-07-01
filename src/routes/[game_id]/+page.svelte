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

	let gameState: GameState | null = null;

	function save() {
		if (!gameState) return;

		const newGameState: GameState = {
			id: gameState.id,
			start: gameState.start,
			end: new Date().toISOString(),
			players: $players
		};

		localStorage.setItem(gameState.id, JSON.stringify(newGameState));
	}

	onMount(() => {
		const idContents = localStorage.getItem(data.id);
		if (!idContents) return;

		gameState = JSON.parse(idContents) as GameState;
		players.set(gameState.players);
		endRound();

		const intervals = [setInterval(() => tick($running), 1000), setInterval(save, 5000)];

		return () => intervals.forEach((interval) => clearInterval(interval));
	});
</script>

{#if $players.length === 0}
	<main class="h-full flex flex-col justify-center items-center">
		<h1 class="text-white text-8xl font-bold mb-4">No game found</h1>
		<p class="text-white text-4xl font-light">No game with id "{data.id}" found</p>
	</main>
{:else}
	<main class="relative h-full flex">
		<Sidebar players={$players} />
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
{/if}
