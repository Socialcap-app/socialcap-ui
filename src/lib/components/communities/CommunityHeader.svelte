<script lang="ts">
	import Time from 'svelte-time/Time.svelte';
	import StateBadge from '../common/StateBadge.svelte';
	import CommunityActions from '../../../routes/(detail)/community/[uid]/CommunityActions.svelte';
	import SubmitButton from '../common/SubmitButton.svelte';
	import type { Community } from '$lib/types';

	export let isAdmin: Boolean = false;
	// export let title: string = '';
	// export let description: string = '';
	export let community: Community;
	export let state = {};
	export let uid: string;
	export let working: string | undefined = undefined;
	export let touched: boolean;
	export let submit: () => void = () => {};
</script>

<div class="flex items-center justify-between">
	<div>
		<StateBadge data={state} />
		<span class="ms-2 text-xs">
			Last update <Time relative={true} timestamp={community.createdUTC.replace('T', ' ')} />
		</span>
	</div>
	{#if isAdmin}
		<SubmitButton
			on:click={(e) => {
				e.preventDefault();
				e.stopPropagation();
				submit();
			}}
			{working}
			disabled={working !== undefined && touched}
			size="md"
			class="bg-sc_red px-3 hover:bg-sc_red lg:w-32"
		>
			Save Changes
		</SubmitButton>
	{/if}
</div>
{#if !isAdmin}
	<div class="my-5 lg:float-right lg:my-0">
		<CommunityActions {community} />
	</div>
{/if}
<h6 class="mb-2 mt-2 pt-1 text-3xl font-bold text-gray-900 dark:text-white">
	{community.name}
</h6>
<p class="mb-2 text-base text-gray-600 dark:text-gray-400">
	{community.description}
</p>
&nbsp;
