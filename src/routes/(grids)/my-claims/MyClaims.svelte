
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
	import NoDataFilters from "$lib/components/common/NoDataFilters.svelte";
	import Search from '$lib/components/common/Search.svelte';


	const claims = useGetMyClaims();

	let inputValue = '';
	let claimsFiltered: Claim[] | undefined = [];

	let filterStatus: number = 0;
	$: presentStatuses = [...new Set($claims.data?.map((e) => e.state))];
	$: {
		/* SEARCH */
		let inputValueLowered = inputValue.toLowerCase();
		claimsFiltered = inputValueLowered
			? $claims.data?.filter(
					(e) =>
						e.description.toLowerCase().includes(inputValueLowered) ||
						e.community.toLowerCase().includes(inputValueLowered) ||
						e.type.toLowerCase().includes(inputValueLowered)
				)
			: $claims.data;
		/* FILTER */
		claimsFiltered = !!filterStatus
			? claimsFiltered?.filter((e) => e.state === filterStatus)
			: claimsFiltered;
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
		<div class="m-auto mb-5 flex w-full flex-wrap items-center justify-between gap-5 text-center">
			<Search bind:value={inputValue} entity="claims" />

			<Select
				class={window.innerWidth > 640 ? 'w-30 h-12' : 'w-full'}
				items={[States[0], ...States.filter((e) => presentStatuses.includes(e.value))]}
				bind:value={filterStatus}
				placeholder="Status"
			/>
		</div>
		{#if claimsFiltered?.length}
			<div class="hidden lg:block">
				<ClaimsTable data={claimsFiltered} />
			</div>
			<div class="block lg:hidden">
				<ClaimsTableMobile data={claimsFiltered} />
			</div>
		{:else}
			<NoDataFilters inputValue={inputValue} onClickClear={() => {inputValue = ''; filterStatus = 0}} />
		{/if}
	{/if}
</div>
