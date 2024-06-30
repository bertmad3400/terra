<script lang="ts">
	import { colors, type Color } from '$lib/colors';
	import { v4 as uuid } from 'uuid';
	import { faXmark } from '@fortawesome/free-solid-svg-icons/index';

	import PlayerAdd from './playerAdd.svelte';
	import Fa from 'svelte-fa';

	let players: { name: string; id: string; color: Color }[] = [
		{ name: 'Anna', id: uuid(), color: colors[6] },
		{ name: 'Bertram', id: uuid(), color: colors[2] },
		{ name: 'Otto', id: uuid(), color: colors[4] },
		{ name: 'Martin', id: uuid(), color: colors[7] }
	];
</script>

<main class="h-full w-full p-6 grid grid-cols-[5fr_0fr_5fr] grid-rows-[6fr_4fr]">
	<section class="h-full border-b mr-4 mb-4 p-4">
		<h2 class="mb-4">Players</h2>
		<ul class="flex flex-col gap-2">
			{#each players as { name, id, color }}
				<li class="relative w-full [&:hover>button]:opacity-100">
					<button
						on:click={() => (players = players.filter((player) => id != player.id))}
						class="
              w-full h-full absolute bg-black/50 opacity-0
              flex justify-center items-center
              transition-opacity
          "
					>
						<Fa icon={faXmark} class="text-3xl text-white" />
					</button>
					<div
						style="background-color: {color.codes[500]};"
						class="
              p-4
              border border-white
              {color.light ? '' : 'text-white'} text-left
            "
					>
						<p class="font-bold text-3xl">{name}</p>
						<p>{id}</p>
					</div>
				</li>
			{/each}
		</ul>
	</section>

	<div class="mb-auto"></div>

	<section
		class="
    ml-4 mb-4 h-full
    border-b
    flex flex-col gap-4
    justify-center items-center
    "
	>
		<PlayerAdd
			reservedColors={players.map(({ color }) => color)}
			on:add={(e) => {
				players = [...players, { name: e.detail.name, color: e.detail.color, id: uuid() }];
			}}
		/>
	</section>

	<section class="h-full">
		<h2>Previous games</h2>
	</section>

	<div class="mt-auto"></div>

	<section class="flex justify-center items-center mt-4 ml-4">
		<button
			title={players.length < 1 ? 'No players have been created' : ''}
			disabled={players.length < 1}
			class="
        w-full h-full
        flex justify-center items-center
        text-white font-bold text-5xl
        bg-red-800 hover:bg-red-700
        disabled:opacity-30 disabled:cursor-not-allowed
        transition-all active:scale-95
      "
		>
			Start game
		</button>
	</section>
</main>

<style lang="postcss">
	h2 {
		@apply text-white font-bold text-4xl;
	}

	main {
		& > * {
			@apply border-gray-300;
		}

		& > div {
			height: calc(100% - 1rem);
			@apply mx-auto border w-0;
		}
	}
</style>
