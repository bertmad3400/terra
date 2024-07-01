<script lang="ts">
	import type { RoundStats } from '$lib/types';

	import { v4 as uuid } from 'uuid';
	import { players, running } from '$lib/state';
	import { tick } from '$lib/state/modify';
	import { colors } from '$lib/colors';
	import { getGridSize } from '$lib/common';
	import { onMount } from 'svelte';

	import UserTimer from './userTimer.svelte';
	import Controls from './controls.svelte';

	$: [cols, rows] = getGridSize($players);

	onMount(() => {
		const defaultRound: RoundStats = {
			passed: false,
			times: [0],
			order: 0,
			active: false
		} as const;

		players.set([
			{
				name: 'Anna',
				id: uuid(),
				color: colors[6],
				rounds: [],
				currentRound: {
					...defaultRound,
					order: 0,
					active: true,
					times: [40, 3500, 0]
				}
			},
			{
				name: 'Bertram',
				id: uuid(),
				color: colors[2],
				rounds: [],
				currentRound: {
					...defaultRound,
					times: [],
					order: 1,
					passed: true
				}
			},
			{
				name: 'Otto',
				id: uuid(),
				color: colors[3],
				rounds: [],
				currentRound: {
					...defaultRound,
					times: [],
					order: 2
				}
			},
			{
				name: 'Martin',
				id: uuid(),
				color: colors[0],
				rounds: [],
				currentRound: {
					...defaultRound,
					times: [],
					order: 3
				}
			}
		]);

		const interval = setInterval(() => tick($running), 1000);

		return () => clearInterval(interval);
	});
</script>

<main class="relative h-full">
	<Controls {running} />
	<section
		style="grid-template: repeat({rows}, 1fr) / repeat({cols}, 1fr);"
		class="grid h-full p-4 {$running ? '' : 'saturate-50'} transition-all"
	>
		{#each $players as player}
			<UserTimer {player} running={$running} />
		{/each}
	</section>
</main>
