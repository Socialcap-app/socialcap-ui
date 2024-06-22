<script lang="ts">
	import { Card, Button } from 'flowbite-svelte';
	import Icon from './Icon.svelte';
	export let text = 'You have no data to display';
	export let title = 'Nothing to see here';
  export let buttons = true;
	export { twClasses as class } ;
</script>

<div class="flex justify-center mt-8 lg:mt-8">
	<Card size="none" class="items-center px-18 py-6 rounded-md border-0 NObg-gray-50 text-center" padding="xl">
			<div class="mb-6">
				<Icon name="NoData" size="8" />
			</div>
			<h6 class="text-lg text-weight-500 mb-2 text-black dark:text-white">{title}</h6>
			<p class="text-weight-400 mb-4 text-sm text-gray-600 dark:text-gray-400 sm:text-sm">
				{@html text.replaceAll('\n', '<br/>')}
			</p>
      {#if buttons}
        <div
          class="items-center justify-center space-y-4 sm:flex sm:space-x-4 sm:space-y-0 rtl:space-x-reverse"
        >
          <Button href="/" color="primary" size="sm">Back home</Button>
          <Button color="none" class="border-0">Learn more</Button>
        </div>
      {/if}  
	</Card>
</div>
