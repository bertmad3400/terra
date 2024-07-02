import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { GameState } from '$lib/types';

export const ssr = false;

export const load: PageLoad = ({ params }) => {
	const id = params.game_id;

	const idContents = localStorage.getItem(id);
	if (!idContents)
		error(404, { message: '', title: 'No game found', desc: `No game with id "${id}" found` });

	const gameState = JSON.parse(idContents) as GameState;

	return {
		gameId: id,
		game: gameState
	};
};
