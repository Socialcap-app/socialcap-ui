<script lang="ts">
	import { useGetMyClaims } from '$lib/hooks/claims';
	import { P, Select } from 'flowbite-svelte';
	import { H1, ErrorOnFetch } from '$lib/components';
	import ClaimsTable from './ClaimsTable.svelte';
	import ClaimsTableMobile from './ClaimsTableMobile.svelte';
	import NoData from '$lib/components/common/NoData.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import type { Claim } from '$lib/types/claim';
	import { States } from '$lib/types/states';

	const claims = useGetMyClaims();

	let inputValue = '';
	let claimsFiltered : Claim[] | undefined = [];

	let filterStatus : number = 0;

	$: {
		let inputValueLowered = inputValue.toLowerCase();
		claimsFiltered = inputValueLowered ? $claims.data?.filter((e)=>
		e.description.toLowerCase().includes(inputValueLowered) ||
		e.community.toLowerCase().includes(inputValueLowered) ||
		e.type.toLowerCase().includes(inputValueLowered)
		) : $claims.data;
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


			<Select class={window.innerWidth > 640 ? "w-30 h-12" : "w-full"} items={States} bind:value={filterStatus} placeholder='Status' />
		</div>
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
	{/if}
</div>
