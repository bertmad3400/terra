<script lang="ts">
	import type { Player } from '$lib/types';
	import { fade, slide } from 'svelte/transition';
	import PlayerList from './playerList.svelte';
	import Fa from 'svelte-fa';
	import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

	export let players: Player[];

	let hidden: boolean = false;

	$: passedPlayers = players
		.filter((player) => player.currentRound.passed)
		.sort((a, b) => a.currentRound.order - b.currentRound.order);
	$: notPassedPlayers = players
		.filter((player) => !player.currentRound.passed)
		.sort((a, b) => a.currentRound.order - b.currentRound.order);
</script>

{#if !hidden}
	<aside
		transition:slide={{ axis: 'x' }}
		class="
    h-full w-96 p-4
  "
	>
		{#if notPassedPlayers.length > 0}
			<h2 transition:fade>Active players</h2>
		{/if}
		<PlayerList players={notPassedPlayers} />

		{#if passedPlayers.length > 0}
			<h2 transition:fade class="odd:mt-16">Passed players</h2>
		{/if}
		<PlayerList players={passedPlayers} containerClass="saturate-50 opacity-60" />
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
