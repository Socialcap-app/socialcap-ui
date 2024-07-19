<script>
	import Time from 'svelte-time/Time.svelte';
	import StateBadge from '../common/StateBadge.svelte';
	import CommunityActions from '../../../routes/(detail)/community/[uid]/CommunityActions.svelte';
	import { useGetAdminCommunity } from '$lib/hooks/communities';

	export let isAdmin = false;
	export let title = '';
	export let description = '';
	export let state = {};
	export let uid;

	let community = useGetAdminCommunity(uid);
	$: cmn = $community.data;
</script>

<div class="flex items-center justify-between">
	<div>
		<StateBadge data={state} />
		<span class="ms-2 text-xs">
			Last update <Time relative={true} timestamp={$community.data?.createdUTC.replace('T', ' ')} />
		</span>
	</div>
</div>
{#if !isAdmin}
	<div class="float-right">
		<CommunityActions community={cmn} />
	</div>
{/if}
<h6 class="mb-2 mt-2 pt-1 text-3xl font-bold text-gray-900 dark:text-white">
	{title}
</h6>
<p class="mb-2 text-base text-gray-600 dark:text-gray-400">
	{description}
</p>
&nbsp;
