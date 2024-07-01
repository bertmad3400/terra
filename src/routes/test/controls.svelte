<script lang="ts">
	import type { Writable } from 'svelte/store';

	import { lastActions } from '$lib/state';
	import { undoAction } from '$lib/state/modify';

	import { faPlay, faRotateLeft, faStop } from '@fortawesome/free-solid-svg-icons';
	import { Fa } from 'svelte-fa';

	export let running: Writable<boolean>;
</script>

<aside
	class="
  bg-black rounded-full overflow-hidden
  w-48 h-24 flex
  z-10 absolute top-1/2 left-1/2
  -translate-x-1/2 -translate-y-1/2
"
>
	<button
		on:click={() => ($running = !$running)}
		class="
    h-24 w-24
    flex justify-center items-center
    text-4xl active:scale-95
    {$running ? 'hover:bg-red-500/20' : 'hover:bg-green-500/10'}
    transition-all
  "
	>
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
