<script lang="ts">
	import { formatTime } from '$lib/common';
	import { slide } from 'svelte/transition';
	import type { Player } from '$lib/types';

	export let players: Player[];
	export let containerClass = '';
</script>

<ul class="flex flex-col gap-3 {containerClass}">
	{#each players as player (player.id)}
		<li
			transition:slide
			style="background-color: {player.color.codes[500]};"
			class="
        {player.color.light ? 'text-black' : 'text-white'}
        p-2 border border-white
      "
		>
			<p class="text-3xl font-bold flex justify-between">
				{player.name}
				<span class="font-light text-2xl">Nr. {player.currentRound.order + 1}</span>
			</p>

			<p>
				{#each player.rounds as { totalTime }}
					{formatTime(totalTime)} -
				{/each}
				{formatTime(player.currentRound.times.reduce((a, b) => a + b, 0))}
			</p>
		</li>
	{/each}
</ul>
