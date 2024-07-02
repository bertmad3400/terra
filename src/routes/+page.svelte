<script lang="ts">
	import { v4 as uuid } from 'uuid';
	import { faCaretDown, faCaretUp, faXmark } from '@fortawesome/free-solid-svg-icons/index';
	import { flip } from 'svelte/animate';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { formatTime, getReadableDate, getReadableTime } from '$lib/common';

	import type { GameState, PartialUser } from '$lib/types';

	import PlayerAdd from './playerAdd.svelte';
	import Fa from 'svelte-fa';

	const idRegex =
		/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}-terra-game/;

	let players: PartialUser[] = [];
	let previousGames: { start: Date; end: Date; id: string; playTime: number }[] = [];

	$: maxOrder = players.length > 0 ? Math.max(...players.map(({ order }) => order)) : -1;
	$: minOrder = Math.min(...players.map(({ order }) => order), -1);

	$: players.sort((a, b) => a.order - b.order);

	function flipOrder(currentPlayer: PartialUser, delta: number) {
		const newOrder = currentPlayer.order + delta;
		const otherPlayer = players.find(({ order }) => order === newOrder);

		if (!otherPlayer) return;

		otherPlayer.order = currentPlayer.order;
		currentPlayer.order = newOrder;

		players = [
			...players.filter((player) => player.id !== currentPlayer.id && player.id !== otherPlayer.id),
			currentPlayer,
			otherPlayer
		];
	}

	function startGame() {
		const game: GameState = {
			id: `${uuid()}-terra-game`,
			start: new Date().toISOString(),
			end: new Date().toISOString(),
			players: []
		};

		players.forEach((player, i) => {
			game.players.push({
				name: player.name,
				id: player.id,
				color: player.color,
				rounds: [],
				currentRound: {
					passed: false,
					active: false,
					times: [],
					order: i
				}
			});
		});

		localStorage.setItem(game.id, JSON.stringify(game));

		goto(`/${game.id}`);
	}

	onMount(() => {
		Object.entries(localStorage).forEach(([k, v]) => {
			if (!idRegex.test(k)) return;

			const contents: GameState = JSON.parse(v);
			const playTime = contents.players.reduce(
				(sum, player) =>
					sum +
					player.rounds.reduce((sum, time) => sum + time.totalTime, 0) +
					player.currentRound.times.reduce((sum, time) => sum + time, 0),
				0
			);

			previousGames = [
				...previousGames,
				{
					start: new Date(contents.start),
					end: new Date(contents.end),
					id: contents.id,
					playTime: playTime
				}
			];
		});
	});
</script>

<main class="h-full w-full p-6 grid grid-cols-[5fr_0fr_5fr] grid-rows-[6fr_4fr]">
	<section class="h-full border-b mr-4 mb-4 p-4">
		<h2 class="mb-4">Players</h2>
		<ul class="flex flex-col gap-2">
			{#each players as player (player.id)}
				{@const { name, order, color, id } = player}
				<li
					animate:flip={{ duration: 400 }}
					style="background-color: {color.codes[500]};"
					class="
            w-full p-4 flex gap-2
            border border-white
            [&:hover>div.actions]:opacity-100
          "
				>
					<div
						class="
              grow {color.light ? '' : 'text-white'} text-left
            "
					>
						<p class="font-bold text-3xl">{name}</p>
						<p>Number {order}</p>
					</div>

					<div class="flex items-center gap-2 actions opacity-0 transition-opacity">
						{#if order > minOrder}
							<button
								on:click={() => flipOrder(player, -1)}
								class="player-action bg-transparent
                  {color.light ? 'hover:bg-black/10' : 'text-white hover:bg-white/20'}"
							>
								<Fa icon={faCaretUp} />
							</button>
						{/if}
						{#if order < maxOrder}
							<button
								on:click={() => flipOrder(player, 1)}
								class="player-action bg-transparent transition-colors
                {color.light ? 'hover:bg-black/10' : 'text-white hover:bg-white/20'}"
							>
								<Fa icon={faCaretDown} />
							</button>
						{/if}
						<button
							on:click={() => (players = players.filter((player) => player.id != id))}
							class="player-action bg-transparent transition-colors
              {color.light ? 'hover:bg-black/10' : 'text-white hover:bg-white/20'}"
						>
							<Fa icon={faXmark} />
						</button>
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
				players = [
					...players,
					{ name: e.detail.name, color: e.detail.color, id: uuid(), order: maxOrder + 1 }
				];
			}}
		/>
	</section>

	<section class="max-h-full p-4 min-h-0 flex flex-col">
		<h2 class="mb-3">Previous games</h2>
		<ul class="flex flex-col gap-3 min-h-0 overflow-y-auto">
			{#each previousGames as { start, end, id, playTime }}
				<li>
					<a
						href="/{id}"
						class="
            p-4 block
            text-white
            bg-white/10 hover:bg-white/20 rounded-xl
            transition-colors duration-300
          "
					>
						<h3 class="text-2xl font-bold flex justify-between">
							{getReadableDate(start)}
							<p class="font-light text-xl">
								{getReadableTime(start)} - {getReadableTime(end)} | {formatTime(playTime)}
							</p>
						</h3>
					</a>
				</li>
			{/each}
		</ul>
	</section>

	<div class="mt-auto"></div>

	<section class="flex justify-center items-center mt-4 ml-4">
		<button
			on:click={startGame}
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

	.player-action {
		@apply flex justify-center items-center
    w-12 h-12 grow-0
    text-2xl
    active:scale-95 transition-all;

		:global(svg) {
			@apply w-4 h-4;
		}
	}
</style>
