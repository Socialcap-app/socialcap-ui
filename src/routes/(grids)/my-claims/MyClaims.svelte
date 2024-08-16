<script lang="ts">
	import { useGetMyClaims } from '$lib/hooks/claims';
	import { P, Select } from 'flowbite-svelte';
	import { H1, ErrorOnFetch } from '$lib/components';
	import ClaimsTable from './ClaimsTable.svelte';
	import ClaimsTableMobile from './ClaimsTableMobile.svelte';
	import NoData from '$lib/components/common/NoData.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';

	const claims = useGetMyClaims();

	let filterStatus : number = 0;

	$:{
		console.log($claims.data);
	}
</script>

<div class="p-4">
	<H1>My Claims</H1>
	<P class="text-gray-400" size="base">Your claimed credentials</P>
	<P class="pb-8"></P>
	{#if $claims.isLoading}
		<LoadingSpinner />
	{:else if $claims.isError}
		<ErrorOnFetch description="All my claims" error={$claims.error} />
	{:else if !$claims.data || $claims.data.length === 0}
		<NoData text="You have no pending claims" />
	{:else}
		<div class="w-full text-center m-auto mb-5">
			<Select class={window.innerWidth > 640 ? "w-30 ml-auto" : "w-full"} items={[
				{ value: 0, name: 'All' },
				{ value: 3, name: 'Danger' } ,
				{ value: 2, name: 'Done' },
				{ value: 1, name: 'Draft' }
			]} bind:value={filterStatus} placeholder='Status' />
		</div>
		<div class="hidden lg:block">
			<ClaimsTable data={
        ($claims.data && Array.isArray($claims.data)) ? (!!filterStatus ? $claims.data.filter((e)=>e.state === filterStatus) :  $claims.data): []
      } />
		</div>
		<div class="block lg:hidden">
			<ClaimsTableMobile data={
        ($claims.data && Array.isArray($claims.data)) ? (!!filterStatus ? $claims.data.filter((e)=>e.state === filterStatus) :  $claims.data): []
      } />
		</div>
	{/if}
</div>
