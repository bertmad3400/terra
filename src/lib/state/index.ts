import type { Action, Player } from '$lib/types';
import type { Writable } from 'svelte/store';

import { writable } from 'svelte/store';

export const lastActions: Writable<(null | Action)[]> = writable([]);
export const players: Writable<Player[]> = writable([]);
export const running = writable(false);
