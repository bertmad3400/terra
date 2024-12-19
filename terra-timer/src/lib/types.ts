import type { Color } from './colors';

export type PartialUser = { name: string; id: string; color: Color; order: number };

export type RoundStats = {
	passed: boolean;
	times: number[];
	order: number;
	active: boolean;
};

export type Player = {
	name: string;
	id: string;
	color: Color;
	rounds: { times: number[]; totalTime: number }[];
	currentRound: RoundStats;
};

export type GameState = {
	id: string;
	start: string;
	end: string;
	players: Player[];
};

export type PlayerChartData = {
	round: number;
	turns: number;
	name: string;
	id: string;
	time: number;
	color: string;
};

export type FinishTurnAction = { type: 'finishTurn'; from: Player; to: Player };
export type PassAction = { type: 'pass'; previousOrder: number; from: Player; to: Player | null };

export type Action = FinishTurnAction | PassAction;
