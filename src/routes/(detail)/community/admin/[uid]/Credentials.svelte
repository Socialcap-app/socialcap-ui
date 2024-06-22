<script lang="ts">
	import { ErrorOnFetch, NoData } from '$lib/components';
	import AdminCredentialsTable from '$lib/components/credentials/AdminCredentialsTable.svelte';
	export let community;
</script>

<div class="mx-auto">
	{#if $community.isLoading}
		<span>Loading...</span>
	{:else if $community.isError}
		<ErrorOnFetch description="My community" error={$community.error} />
	{:else if !$community.data.plans || !($community.data.plans || []).length}
		<NoData text="There is no campaings created." title="No campaigns found" buttons={false} />
	{:else}
		<AdminCredentialsTable data={$community.data.plans} communityUid={$community.data.uid}/>
	{/if}
</div>
