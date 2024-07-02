<script lang="ts">
	import type { GameState } from '$lib/types';

	import { fade, slide } from 'svelte/transition';
	import { faArrowLeft, faChartSimple } from '@fortawesome/free-solid-svg-icons';

	import PlayerList from './playerList.svelte';
	import Fa from 'svelte-fa';

	export let game: GameState;

	let hidden: boolean = false;

	$: passedPlayers = game.players
		.filter((player) => player.currentRound.passed)
		.sort((a, b) => a.currentRound.order - b.currentRound.order);
	$: notPassedPlayers = game.players
		.filter((player) => !player.currentRound.passed)
		.sort((a, b) => a.currentRound.order - b.currentRound.order);
</script>

{#if !hidden}
	<aside
		transition:slide={{ axis: 'x' }}
		class="
      h-full w-96 p-4 flex flex-col justify-between
    "
	>
		<section>
			{#if notPassedPlayers.length > 0}
				<h2 transition:fade>Active players</h2>
			{/if}
			<PlayerList players={notPassedPlayers} />

			{#if passedPlayers.length > 0}
				<h2 transition:fade class="odd:mt-16">Passed players</h2>
			{/if}
			<PlayerList players={passedPlayers} containerClass="saturate-50 opacity-60" />
		</section>

		<a
			target="_blank"
			class="
        w-20 h-20 ml-auto
        flex justify-center items-center
        bg-gray-800 hover:bg-gray-700 rounded-full
        text-white text-3xl
        transition-all duration-300
      "
			href="/{game.id}/stats"
		>
			<Fa icon={faChartSimple} />
		</a>
	</aside>
{/if}

<button
	on:click={() => (hidden = !hidden)}
	class:rotate-180={hidden}
	class="
    absolute z-20 left-4 bottom-4
    bg-gray-800 hover:bg-gray-700 rounded-full
    w-20 h-20 flex justify-center items-center
    text-white text-3xl
    transition-all duration-300
    {hidden ? 'opacity-25 hover:opacity-100' : ''}
  "
>
	<Fa icon={faArrowLeft} />
</button>

<style lang="postcss">
	h2 {
		@apply text-4xl text-white font-bold mb-3;
	}
</style>
