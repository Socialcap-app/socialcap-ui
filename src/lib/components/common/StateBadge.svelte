<script>
	import { Badge } from 'flowbite-svelte';
	import { States, toState } from '$lib/types/states';
	let clazz = '';
	export { clazz as class };
	export let data; // State number

	console.log('clazz', clazz);
	let state = toState(data);
	$: {
		state = toState(data);
	}
</script>

{#if state.badgeType === 'info'}
	<Badge rounded color="yellow" class={`px-3 py-1 text-yellow-800 lg:px-4 lg:py-2 ${clazz || ''}`}>
		<p class="text-xs">{state.name}</p>
	</Badge>
{/if}

{#if state.badgeType === 'danger'}
	<Badge rounded color="red" class={`px-3 py-1 text-red-800 lg:px-4 lg:py-2 ${clazz || ''}`}>
		<p class="text-xs">{state.name}</p>
	</Badge>
{/if}

{#if state.badgeType === 'success'}
	<Badge rounded color="green" class={`px-3 py-1 text-green-800 lg:px-4 lg:py-2 ${clazz || ''}`}>
		<p class="text-xs">{state.name}</p>
	</Badge>
{/if}

{#if state.badgeType === 'warning'}
	<Badge rounded color="yellow" class={`px-3 py-1 text-gray-800 lg:px-4 lg:py-2 ${clazz || ''}`}>
		<p class="text-xs">{state.name}</p>
	</Badge>
{/if}
