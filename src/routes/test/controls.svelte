<script lang="ts">
	import type { Writable } from 'svelte/store';

	import { lastActions, players } from '$lib/state';
	import { endRound, undoAction } from '$lib/state/modify';

	import {
		faArrowRightFromBracket,
		faPlay,
		faRotateLeft,
		faStop
	} from '@fortawesome/free-solid-svg-icons';
	import { Fa } from 'svelte-fa';

	export let running: Writable<boolean>;

	$: endable = $players.filter((player) => !player.currentRound.passed).length === 0;
</script>

<aside
	class="
  bg-black rounded-full overflow-hidden
  w-72 h-24 flex
  z-10 absolute top-1/2 left-1/2
  -translate-x-1/2 -translate-y-1/2
"
>
	<button on:click={() => ($running = !$running)}>
		{#if $running}
			<Fa icon={faStop} class="text-red-500" />
		{:else}
			<Fa icon={faPlay} class="text-green-500" />
		{/if}
	</button>

	<button
		disabled={$lastActions.length < 1}
		title={$lastActions.length < 1 ? 'No actions to undo' : 'Undo last action'}
		on:click={() => undoAction()}
	>
		<Fa icon={faRotateLeft} />
	</button>

	<button
		disabled={!endable}
		title={endable ? 'Go to next round' : 'Not everyone has passed yet'}
		on:click={endRound}
	>
		<Fa icon={faArrowRightFromBracket} />
	</button>
</aside>

<style lang="postcss">
	button {
		@apply h-24 w-24
    flex justify-center items-center
    text-white text-4xl active:scale-95
    transition-all hover:bg-white/20
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent;
	}
</style>
