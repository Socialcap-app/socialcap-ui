<script lang="ts">
	import { ErrorOnFetch, NoData } from '$lib/components';
	import AdminCredentialsTable from '$lib/components/credentials/AdminCredentialsTable.svelte';
	import { useGetAdminCommunityPlans } from '$lib/hooks/communities';
	export let communityUid, plans;
</script>

<div class="mx-auto">
	{#if $plans.isLoading}
		<span>Loading...</span>
	{:else if $plans.isError}
		<ErrorOnFetch description="My community" error={$plans.error} />
	{:else if !$plans.data || !($plans.data || []).length}
		<NoData text="There is no campaings created." title="No campaigns found" buttons={false} />
	{:else}
		<AdminCredentialsTable data={$plans.data} {communityUid}/>
	{/if}
</div>
