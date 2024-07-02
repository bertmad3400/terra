<script lang="ts">
	import { colors, type Color } from '$lib/colors';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ add: { name: string; color: Color } }>();

	export let reservedColors: Color[];

	let name = '';

	$: reservedNames = reservedColors.map(({ name }) => name);
	$: availableColors = colors.filter(({ name }) => !reservedNames.includes(name));

	$: selectedColor = availableColors[0];

	function add() {
		if (name.length < 1) return;

		dispatch('add', { name, color: selectedColor });
		name = '';
	}
</script>

<form on:submit|preventDefault={add} class="flex flex-col items-center gap-4">
	<input
		bind:value={name}
		style="background-color: {selectedColor.codes[500]};"
		type="text"
		placeholder="Player name"
		class="
        p-4
        border !border-white
        text-xl
        {selectedColor.light ? 'placeholder:text-black/75' : 'text-white placeholder:text-white/75'}

        bg-transparent rounded-2xl

        focus:outline-none focus:shadow-none focus:ring-transparent
        transition-colors
    "
	/>

	<div class="flex gap-2 flex-wrap">
		{#each availableColors as currentColor}
			{@const selected = currentColor.name === selectedColor.name}
			<button
				on:click={() => (selectedColor = currentColor)}
				title={currentColor.name}
				style="background-color: {currentColor.codes[500]};"
				class="
            w-8 h-8 shrink-0
            border border-white
            {selected ? '' : 'opacity-50 hover:opacity-90'}
            active:scale-95 transition-all
          "
			></button>
		{/each}
	</div>

	<button
		disabled={name.length < 1}
		title={name.length < 1 ? 'Please enter a name' : ''}
		style="background-color: {selectedColor.codes[500]};"
		class="
      border border-white
      p-3 rounded-xl
      {selectedColor.light ? '' : 'text-white'} font-bold text-2xl
    hover:brightness-125 disabled:opacity-50 disabled:cursor-not-allowed
      transition-all active:scale-95
      "
	>
		Add player
	</button>
</form>
