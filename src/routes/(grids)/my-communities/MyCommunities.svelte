<script lang="ts">
	import { onMount } from 'svelte';
	import { CACHE, type APIResponse } from '$lib/api';
	import { P, Select } from 'flowbite-svelte';
	import { H1, H1Subtitle, ErrorOnFetch } from '$lib/components';
	import CommunitiesList from '$lib/components/communities/CommunitiesList.svelte';
	import { useGetMyCommunities } from '$lib/hooks/communities';
	import NoData from '$lib/components/common/NoData.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import type { Community } from '$lib/types';
	import Search from '$lib/components/common/Search.svelte';
	import { CommunityStates } from '$lib/types/states';
	import NoDataFilters from '$lib/components/common/NoDataFilters.svelte';

	const communities = useGetMyCommunities();
	let inputValue = '';
	let communitiesFiltered: Community[] | undefined = [];

	let filterStatus: string = '';

	$: {
		/* SEARCH */
		let inputValueLowered = inputValue.toLowerCase();
		communitiesFiltered = inputValueLowered
			? $communities.data?.filter(
					(e) =>
						e.description.toLowerCase().includes(inputValueLowered) ||
						e.name.toLowerCase().includes(inputValueLowered) ||
						e.state.toLowerCase().includes(inputValueLowered)
				)
			: $communities.data;
		/* FILTER */
		communitiesFiltered = !!filterStatus
			? communitiesFiltered?.filter((e) => e.state === filterStatus)
			: communitiesFiltered;
	}

	$: {
		let inputValueLowered = inputValue.toLowerCase();
		communitiesFiltered = inputValueLowered
			? $communities.data?.filter(
					(e) =>
						e.description.toLowerCase().includes(inputValueLowered) ||
						e.name.toLowerCase().includes(inputValueLowered) ||
						e.state.toLowerCase().includes(inputValueLowered)
				)
			: $communities.data;
	}
</script>

<div class="p-4">
	<div>
		<H1>My Communities</H1>
		<H1Subtitle>
			You are a member of {($communities.data || []).length} communities
		</H1Subtitle>
		<!-- <p class="pt-4 text-end">
      <Select class="max-w-32 inline-block">
        <option selected value="all">Show All</option>
      </Select>
    </p> -->
	</div>

	<div class="pt-8 lg:pt-16">
		{#if $communities.isLoading}
			<LoadingSpinner />
		{:else if $communities.isError}
			<ErrorOnFetch description="All the communities" error={$communities.error} />
		{:else if !$communities.data || $communities.data.length === 0}
			<NoData text="You didn’t join any community yet" />
		{:else if $communities.data?.length}
			<div class="m-auto mb-5 flex w-full flex-wrap items-center justify-between gap-5 text-center">
				<Search bind:value={inputValue} entity="communities" />
				<Select
					class={window.innerWidth > 640 ? 'w-30 h-12' : 'w-full'}
					items={[
						{ name: 'None', value: '' },
						...Object.entries(CommunityStates).map(([key, value]) => ({
							name: key,
							value: value
						}))
					]}
					bind:value={filterStatus}
					placeholder="Status"
				/>
			</div>

			{#if communitiesFiltered?.length}
				<ul>
					<CommunitiesList data={communitiesFiltered} joined={true} grid="2" />
				</ul>
			{:else}
				<NoDataFilters
					{inputValue}
					onClickClear={() => {
						inputValue = '';
						filterStatus = '';
					}}
				/>
			{/if}
		{/if}
	</div>
</div>
