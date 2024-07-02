<script lang="ts">
	import { formatTime, getPlayTotalTime } from '$lib/common';
	import type { Player, PlayerChartData } from '$lib/types';
	import type { PageData } from './$types';
	import AverageTimeChart from './averageTimeChart.svelte';

	import TimeChart from './timeChart.svelte';
	import TurnChart from './turnChart.svelte';

	export let data: PageData;

	let hoveredPlayer: Player | null = null;

	const getColor = (player: Player, hoveredPlayer: Player | null) =>
		hoveredPlayer && hoveredPlayer.id !== player.id
			? `${player.color.codes[500]}50`
			: player.color.codes[500];

	let playerData: PlayerChartData[];
	$: playerData = data.game.players
		.map((player) =>
			player.rounds.map(({ totalTime, times }, i) => ({
				round: i,
				turns: times.length,
				name: player.name,
				id: player.id,
				time: totalTime,
				color: getColor(player, hoveredPlayer)
			}))
		)
		.flat();
</script>

<main class="p-8">
	<h2 class="text-5xl font-bold text-white mb-4">Players:</h2>
	<ul class="flex flex-wrap gap-4 mb-16">
		{#each data.game.players as player}
			<li
				on:pointerenter={() => (hoveredPlayer = player)}
				on:pointerleave={() => (hoveredPlayer = null)}
				style="background-color: {getColor(player, hoveredPlayer)};"
				class="
          cursor-pointer transition-colors
          p-2 grow min-w-fit
          border border-white
          {player.color.light ? '' : 'text-white'}
        "
			>
				<h3 class="font-bold text-2xl flex justify-between items-center">
					{player.name}
					<p class="ml-8 font-light text-xl">
						{formatTime(getPlayTotalTime(player))}
						|
						{player.rounds.reduce((sum, { times }) => sum + times.length, 0)} rounds
					</p>
				</h3>
			</li>
		{/each}
	</ul>

	<h2 class="text-3xl font-bold text-white mb-4">Round lengths:</h2>
	<TimeChart {playerData} />

	<h2 class="text-3xl font-bold text-white mb-4">Average turn length:</h2>
	<AverageTimeChart {playerData} />

	<h2 class="text-3xl font-bold text-white mb-4 mt-16">Turns per round:</h2>
	<TurnChart {playerData} />
</main>
