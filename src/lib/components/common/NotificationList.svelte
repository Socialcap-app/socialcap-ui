<script lang="ts">
	import { Popover, ToolbarButton } from 'flowbite-svelte';
  import { BellSolid } from 'flowbite-svelte-icons';
  import { Icon } from "$lib/components"
  import ActivitiesList from '../activities/ActivitiesList.svelte';
	import { type Activity } from '$lib/types';
</script>

<ToolbarButton size="lg" class="h-11 -mx-0.5 hover:text-gray-900 dark:hover:text-white">
  <Icon name="Notifications" size="6" />
  <!-- <BellSolid  class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" /> -->
</ToolbarButton>

<Popover class="max-w-md border-0" trigger="click" defaultClass="p-0" arrow={false} offset={10}>
	<div slot="title" class="rounded text-center">Notifications</div>
	<div class="bg-50 dark:bg-gray-700 p-5">
    <ActivitiesList limit={5} />
	</div>
</Popover>
