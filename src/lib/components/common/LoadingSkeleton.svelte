<script>
	import {
		CardPlaceholder,
		ImagePlaceholder,
		Skeleton,
		TextPlaceholder,
		VideoPlaceholder
	} from 'flowbite-svelte';

	export let isLoading;
	export let type = 'default';
	export let size = 'lg';
	export let extraClasses = '';
</script>

{#if isLoading}
	{#if type === 'card'}
		<CardPlaceholder {size} class={'m-auto overflow-hidden ' + extraClasses} />
	{:else if type === 'image'}
		<ImagePlaceholder imgOnly class={'m-auto overflow-hidden ' + extraClasses} />
	{:else if type === 'video'}
		<VideoPlaceholder {size} class={'m-auto overflow-hidden ' + extraClasses} />
	{:else if type === 'text'}
		<TextPlaceholder {size} class={'m-auto overflow-hidden ' + extraClasses} />
	{:else}
		<Skeleton {size} class={'m-auto overflow-hidden ' + extraClasses} />
	{/if}
{:else}
	<slot />
{/if}

<style>
</style>
