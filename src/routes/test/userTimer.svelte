<script lang="ts">
	import type { Player } from '$lib/types';

	import { formatTime } from '$lib/common';
	import { changeTime, finishTurn, passRound } from '$lib/state/modify';

	import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	export let player: Player;
	export let running: boolean;
</script>

<div class="relative p-1">
	<button
		on:click={() => {
			if (running) {
				finishTurn(player);
			}
		}}
		title={player.currentRound.active ? 'Finish your turn' : `It isn't ${player.name}s turn`}
		disabled={!player.currentRound.active}
		style="background-color: {player.color.codes[500]};"
		class="
      h-full w-full
      disabled:opacity-50 disabled:active:scale-100
      {running ? 'active:scale-95 hover:brightness-125 disabled:cursor-not-allowed' : 'cursor-auto'}
      {player.currentRound.passed ? 'saturate-0' : ''}
      hover:disabled:brightness-100
      transition-all
  "
	>
		<h2
			class="
      text-8xl font-bold
      {player.color.light ? '' : 'text-white'}
      {player.currentRound.passed ? 'line-through opacity-50' : ''}
      "
		>
			{player.name}
		</h2>
		<p class="text-5xl font-light {player.color.light ? '' : 'text-white'}">
			{formatTime(
				player.currentRound.times.reduce((a, b) => a + b, 0) +
					player.rounds.reduce((sum, rounds) => sum + rounds.totalTime, 0)
			)}
		</p>
	</button>
	{#if player.currentRound.active}
		<div
			class="
        {player.color.light ? 'bg-black/10' : 'bg-white/20 text-white'}
        absolute bottom-8 left-1/2 -translate-x-1/2
        transition-all
        flex items-center justify-center
        mx-auto mt-6
        overflow-hidden h-12 w-fit rounded-full

        [&>button]:font-bold [&>button]:text-2xl [&>button]:p-4
        [&>button]:transition-all [&>button:active]:scale-95
        {player.color.light ? '[&>button:hover]:bg-black/10' : '[&>button:hover]:bg-white/20'}
      "
		>
			<button on:click={() => changeTime(player.id, -20)}>
				<p>-20</p>
			</button>
			<button on:click={() => passRound(player)} title="Pass round">
				<Fa icon={faArrowRightToBracket} />
			</button>
			<button on:click={() => changeTime(player.id, 20)}>
				<p>+20</p>
			</button>
		</div>
	{/if}
</div>
