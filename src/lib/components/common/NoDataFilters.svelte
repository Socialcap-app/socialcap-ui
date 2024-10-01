<script lang="ts">
	import { Card, Button } from 'flowbite-svelte';
	import Icon from './Icon.svelte';
	export let title = '';
	export let inputValue = '';
	export let onClickClear = () => {};
	export let text =
		'Your search did not match any results. You may want to clear the filters.';
	export { twClasses as class };
</script>

<div class="mt-8 flex w-full justify-center lg:mt-8">
	<Card
		size="none"
		class="px-18 NObg-gray-50 items-center rounded-md border-0 py-6 text-center"
		padding="xl"
	>
		<div class="mb-6">
			<Icon name="NoData" size="8" />
		</div>
		<h6 class="text-weight-500 mb-2 text-lg text-black dark:text-white">{title}</h6>
		<p class="text-weight-400 mb-4 text-sm text-gray-600 dark:text-gray-400 sm:text-sm">
			{text}
		</p>
		<div
			class="items-center justify-center space-y-4 sm:flex sm:space-x-4 sm:space-y-0 rtl:space-x-reverse"
		>
			<Button on:click={() => onClickClear()} color="blue" class="border-0">Clear Filters</Button>
		</div>
	</Card>
</div>
