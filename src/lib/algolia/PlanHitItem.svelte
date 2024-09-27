<script>
	import { goto } from '$app/navigation';

	export let hit;

	console.log(hit);
</script>

<button
	on:click={() => goto(`/plan/${hit.uid}`)}
	class="my-2 flex w-full cursor-pointer items-center justify-center rounded bg-gray-200 px-5 py-2"
>
	<div class="flex-1">
		{#if hit.name}
			<h1 class="text-sm font-bold">{@html hit.name}</h1>
		{/if}
		{#if hit.description}
			<p>Description: {@html hit.description}</p>
		{/if}
	</div>
	{#if hit.image}
		<div class="overflow-hidden">
			<img class="max-h-28 w-32 rounded" src={hit.image} alt={hit.name} />
		</div>
	{/if}
</button>

<style>
	/* highlights text matching the search string */
	:global(em) {
		color: darkcyan;
		line-height: 1.2em;
		border-radius: 3pt;
		font-style: normal;
	}
</style>
