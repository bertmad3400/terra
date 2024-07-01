<script lang="ts">
	import { v4 as uuid } from 'uuid';
	import { colors, type Color } from '$lib/colors';
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import Fa from 'svelte-fa';
	import {
		faArrowRightToBracket,
		faPlay,
		faRotateLeft,
		faStop
	} from '@fortawesome/free-solid-svg-icons';

	type RoundStats = {
		passed: boolean;
		times: number[];
		order: number;
		active: boolean;
	};

	type Player = {
		name: string;
		id: string;
		color: Color;
		rounds: { times: number[]; totalTime: number }[];
		currentRound: RoundStats;
	};

	type FinishTurnAction = { type: 'finishTurn'; from: Player; to: Player };
	type PassAction = { type: 'pass'; previousOrder: number; from: Player; to: Player | null };

	type Action = FinishTurnAction | PassAction;

	const defaultRound: RoundStats = { passed: false, times: [0], order: 0, active: false } as const;

	function getGridSize(arr: any[]): [number, number] {
		let [col, row] = [0, 0];

		for (let i = 1; i < 10; i++) {
			col = i;

			if (col * row >= arr.length) return [col, row];

			row = i;

			if (col * row >= arr.length) return [col, row];
		}

		throw new Error(`Excedded max grid size with length of ${arr.length}`);
	}

	function formatTime(seconds: number) {
		const pad = (n: number) => String(n).padStart(2, '0');

		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);

		let timeString = `${hours > 0 ? pad(minutes) : minutes}:${pad(seconds % 60)}`;

		if (hours > 0) timeString = `${hours}:` + timeString;

		return timeString;
	}

	let players: Writable<Player[]> = writable([
		{
			name: 'Anna',
			id: uuid(),
			color: colors[6],
			rounds: [],
			currentRound: {
				...defaultRound,
				order: 0,
				active: true,
				times: [40, 3500]
			}
		},
		{
			name: 'Bertram',
			id: uuid(),
			color: colors[2],
			rounds: [],
			currentRound: {
				...defaultRound,
				times: [0],
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
				times: [0],
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
				times: [0],
				order: 3
			}
		}
	]);

	$: [cols, rows] = getGridSize($players);

	let running = true;
	let lastActions: Writable<(null | Action)[]> = writable([]);

	function tick() {
		if (!running) return;

		players.update((players) => {
			players.forEach((player) => {
				if (!player.currentRound.active) return;

				player.currentRound.times[0] += 1;
			});

			return players;
		});
	}

	function getNextPlayer(currentPlayer: Player, playerList: Player[]): Player | undefined {
		const getOrderDist = (currentOrder: number, nextOrder: number, length: number) =>
			currentOrder < nextOrder ? nextOrder - currentOrder : length - currentOrder + nextOrder;

		let nextPlayer: [Player, number] | undefined;

		playerList.forEach((player) => {
			if (
				player.currentRound.active ||
				player.currentRound.passed ||
				player.id === currentPlayer.id
			)
				return;

			const orderDist = getOrderDist(
				currentPlayer.currentRound.order,
				player.currentRound.order,
				playerList.length
			);

			if (!nextPlayer) {
				nextPlayer = [player, orderDist];
				return;
			} else if (nextPlayer[1] > orderDist) {
				nextPlayer = [player, orderDist];
			}
		});

		return nextPlayer?.[0];
	}

	function finishTurn(finishedPlayer: Player) {
		players.update((players) => {
			const nextPlayer = getNextPlayer(finishedPlayer, players);

			if (!nextPlayer) return players;

			players.forEach((player) => {
				if (player.id === finishedPlayer.id) player.currentRound.active = false;
				if (player.id === nextPlayer.id) player.currentRound.active = true;
			});

			lastActions.update((actions) => [
				...actions,
				{ type: 'finishTurn', from: finishedPlayer, to: nextPlayer }
			]);

			return players;
		});
	}

	function passRound(passingPlayer: Player) {
		const previousPassing = passingPlayer.currentRound.order;
		players.update((players) => {
			// Needs to calculate prior to passing and changing order
			const nextPlayer = getNextPlayer(passingPlayer, players);

			const maxPassedOrder = Math.max(
				...players
					.filter((player) => player.currentRound.passed)
					.map((player) => player.currentRound.order),
				-1
			);

			players.forEach((player) => {
				if (player.id === passingPlayer.id) {
					player.currentRound.active = false;
					player.currentRound.passed = true;
					player.currentRound.order = maxPassedOrder + 1;
					player.rounds.push({
						times: player.currentRound.times,
						totalTime: player.currentRound.times.reduce((a, b) => a + b, 0)
					});
					player.currentRound.times = [0];
				}
			});

			if (nextPlayer)
				players.forEach((player) => {
					if (player.id === nextPlayer.id) player.currentRound.active = true;
				});

			lastActions.update((actions) => [
				...actions,
				{
					type: 'pass',
					previousOrder: previousPassing,
					from: passingPlayer,
					to: nextPlayer ?? null
				}
			]);

			return players;
		});
	}

	function changeTime(id: string, delta: number) {
		players.update((players) => {
			players.forEach((player) => {
				if (player.id === id) {
					const time = player.currentRound.times.pop();
					if (!time) return;
					player.currentRound.times.push(time + delta);
				}
			});

			return players;
		});
	}

	function undo() {
		const undoFinish = (action: FinishTurnAction) =>
			players.update((players) => {
				players.forEach((player) => {
					if (player.id === action.from.id) {
						player.currentRound.active = true;
					} else if (player.id === action.to.id) {
						player.currentRound.active = false;
						player.currentRound.times.pop();
						player.currentRound.times.push(0);
					}
				});

				return players;
			});

		const undoPass = (action: PassAction) =>
			players.update((players) => {
				players.forEach((player) => {
					if (player.id === action.from.id) {
						player.currentRound.active = true;
						player.currentRound.passed = false;
						player.currentRound.order = action.previousOrder;
						player.currentRound.times = player.rounds.pop()?.times ?? [0];
					} else if (action.to && player.id === action.to.id) {
						player.currentRound.active = false;
						player.currentRound.times.pop();
						player.currentRound.times.push(0);
					}
				});

				return players;
			});

		let action: null | undefined | Action;

		lastActions.update((actions) => {
			action = actions.pop();
			return actions;
		});

		if (action?.type === 'finishTurn') undoFinish(action);
		else if (action?.type === 'pass') undoPass(action);
	}

	onMount(() => {
		const interval = setInterval(tick, 1000);

		return () => clearInterval(interval);
	});
</script>

<main class="relative h-full">
	<aside
		class="
    bg-black rounded-full overflow-hidden
    w-48 h-24 flex
    z-10 absolute top-1/2 left-1/2
    -translate-x-1/2 -translate-y-1/2
  "
	>
		<button
			on:click={() => (running = !running)}
			class="
      h-24 w-24
      flex justify-center items-center
      text-4xl active:scale-95
      {running ? 'hover:bg-red-500/20' : 'hover:bg-green-500/10'}
      transition-all
    "
		>
			{#if running}
				<Fa icon={faStop} class="text-red-500" />
			{:else}
				<Fa icon={faPlay} class="text-green-500" />
			{/if}
		</button>

		<button
			disabled={$lastActions.length < 1}
			title={$lastActions.length < 1 ? 'No actions to undo' : 'Undo last action'}
			on:click={() => undo()}
			class="
      h-24 w-24
      flex justify-center items-center
      text-4xl text-white
      disabled:text-white/50 disabled:cursor-not-allowed
      active:scale-95
      hover:bg-white/20 disabled:hover:bg-transparent
      transition-all
    "
		>
			<Fa icon={faRotateLeft} />
		</button>
	</aside>
	<section
		style="grid-template: repeat({rows}, 1fr) / repeat({cols}, 1fr);"
		class="grid h-full p-4 {running ? '' : 'saturate-50'} transition-all"
	>
		{#each $players as player}
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
            {running
						? 'active:scale-95 hover:brightness-125 disabled:cursor-not-allowed'
						: 'cursor-auto'}
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
		{/each}
	</section>
</main>

<style lang="postcss">
</style>
