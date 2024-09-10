<script lang="ts">
	import { useGetMyClaims } from '$lib/hooks/claims';
	import { Button, Card, P, Select } from 'flowbite-svelte';
	import { H1, ErrorOnFetch } from '$lib/components';
	import ClaimsTable from './ClaimsTable.svelte';
	import ClaimsTableMobile from './ClaimsTableMobile.svelte';
	import NoData from '$lib/components/common/NoData.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import type { Claim } from '$lib/types/claim';
	import { States } from '$lib/types/states';
	import Icon from '$lib/components/common/Icon.svelte';

	const claims = useGetMyClaims();

	let inputValue = '';
	let claimsFiltered : Claim[] | undefined = [];

	let filterStatus : number = 0;
	let presentStatuses = [...new Set($claims.data?.map((e) => e.state))];
	$: {
		/* SEARCH */
		let inputValueLowered = inputValue.toLowerCase();
		claimsFiltered = inputValueLowered ? $claims.data?.filter((e)=>
		e.description.toLowerCase().includes(inputValueLowered) ||
		e.community.toLowerCase().includes(inputValueLowered) ||
		e.type.toLowerCase().includes(inputValueLowered)
		) : $claims.data;
		/* FILTER */
		claimsFiltered = !!filterStatus ? claimsFiltered?.filter((e)=>e.state === filterStatus) : claimsFiltered;
	}
	/* ($claims.data && Array.isArray($claims.data)) ? (!!filterStatus ? $claims.data.filter((e)=>e.state === filterStatus) :  $claims.data): [] */
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
		<div class="w-full text-center m-auto mb-5 flex items-center justify-between flex-wrap gap-5">
			<div class='w-80'>   
				<label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
				<div class="relative">
					<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
						<svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
						</svg>
					</div>
					<input bind:value={inputValue} type="search" id="default-search" placeholder="Search claims..." required class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
				</div>
			</div>


			<Select class={window.innerWidth > 640 ? "w-30 h-12" : "w-full"} items={[ States[0] ,...States.filter((e)=>presentStatuses.includes(e.value))]} bind:value={filterStatus} placeholder='Status' />
		</div>
		{#if claimsFiltered?.length}
			<div class="hidden lg:block">
				<ClaimsTable data={
					claimsFiltered
				} />
			</div>
			<div class="block lg:hidden">
				<ClaimsTableMobile data={
					claimsFiltered
				} />
			</div>
		{:else}
			<div class="flex justify-center w-full mt-8 lg:mt-8">
				<Card size="none" class="items-center px-18 py-6 rounded-md border-0 NObg-gray-50 text-center" padding="xl">
						<div class="mb-6">
							<Icon name="NoData" size="8" />
						</div>
						<h6 class="text-lg text-weight-500 mb-2 text-black dark:text-white">No Claims were found!</h6>
						<p class="text-weight-400 mb-4 text-sm text-gray-600 dark:text-gray-400 sm:text-sm">
							{inputValue ? 'Your search "'+inputValue+'" did not match any results. You may want to clear the filters.' 
							: 'There are no Claims to show in this page. Go home and generate some!'}
						</p>
					<div
					class="items-center justify-center space-y-4 sm:flex sm:space-x-4 sm:space-y-0 rtl:space-x-reverse"
					>
					<Button on:click={()=>{inputValue=''; filterStatus = 0;}} color="blue" class="border-0">Clear Filters</Button>
					</div>
				</Card>
			</div>
		
		{/if}
	{/if}
</div>
