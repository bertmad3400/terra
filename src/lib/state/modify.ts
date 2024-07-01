import type { Action, FinishTurnAction, PassAction, Player } from '$lib/types';
import { players, lastActions } from './index';

export function undoAction() {
	const undoFinish = (action: FinishTurnAction) =>
		players.update((players) => {
			players.forEach((player) => {
				if (player.id === action.from.id) {
					player.currentRound.active = true;
				} else if (player.id === action.to.id) {
					player.currentRound.active = false;
					player.currentRound.times.pop();
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

export function getNextPlayer(currentPlayer: Player, playerList: Player[]): Player | undefined {
	const getOrderDist = (currentOrder: number, nextOrder: number, length: number) =>
		currentOrder < nextOrder ? nextOrder - currentOrder : length - currentOrder + nextOrder;

	let nextPlayer: [Player, number] | undefined;

	playerList.forEach((player) => {
		if (player.currentRound.active || player.currentRound.passed || player.id === currentPlayer.id)
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

export function finishTurn(finishedPlayer: Player) {
	players.update((players) => {
		const nextPlayer = getNextPlayer(finishedPlayer, players);

		if (!nextPlayer) return players;

		players.forEach((player) => {
			if (player.id === finishedPlayer.id) player.currentRound.active = false;
			if (player.id === nextPlayer.id) {
				player.currentRound.active = true;
				player.currentRound.times.push(0);
			}
		});

		lastActions.update((actions) => [
			...actions,
			{ type: 'finishTurn', from: finishedPlayer, to: nextPlayer }
		]);

		return players;
	});
}

export function passRound(passingPlayer: Player) {
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
				player.currentRound.times = [];
			}
		});

		if (nextPlayer)
			players.forEach((player) => {
				if (player.id === nextPlayer.id) {
					player.currentRound.active = true;
					player.currentRound.times.push(0);
				}
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

export function changeTime(id: string, delta: number) {
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

export function tick(running: boolean) {
	if (!running) return;

	players.update((players) => {
		players.forEach((player) => {
			if (!player.currentRound.active) return;

			const time = player.currentRound.times.pop();
			player.currentRound.times.push(time ? time + 1 : 1);
		});

		return players;
	});
}
