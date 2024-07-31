<script lang="ts">
	import { ErrorOnFetch, NoData } from '$lib/components';
	import AdminCredentialsTable from '$lib/components/credentials/AdminCredentialsTable.svelte';
	import { Button } from 'flowbite-svelte';
	import { CirclePlusSolid } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	export let community;
</script>

<div class="mx-auto">
	{#if $community.isLoading}
	<LoadingSpinner />
	{:else if $community.isError}
		<ErrorOnFetch description="My community" error={$community.error} />
	{:else}
		<div class="flex flex-col items-end space-y-2">
			{#if !$community.data.plans || !($community.data.plans || []).length}
				<NoData text="There is no campaings created." title="No campaigns found" buttons={false} />
			{:else}
				<AdminCredentialsTable data={$community.data.plans} communityUid={$community.data.uid} />
			{/if}
			<Button
				color="blue"
				class="py-3"
				on:click={() => goto(`/plan/admin/new?communityUid=${$community.data.uid}`)}
				><CirclePlusSolid class="me-2 h-5 w-5" /> Create a campaign</Button
			>
		</div>
	{/if}
</div>
