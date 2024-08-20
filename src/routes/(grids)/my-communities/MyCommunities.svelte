<script lang="ts">
  import { onMount } from "svelte";
  import { CACHE, type APIResponse } from "$lib/api";
  import { P, Select } from "flowbite-svelte";
  import { H1, H1Subtitle, ErrorOnFetch } from "$lib/components";
	import CommunitiesList from "$lib/components/communities/CommunitiesList.svelte";
  import { useGetMyCommunities } from "$lib/hooks/communities";
	import NoData from "$lib/components/common/NoData.svelte";
	import LoadingSpinner from "$lib/components/common/LoadingSpinner.svelte";
	import type { Community } from "$lib/types";
  
  const communities = useGetMyCommunities();
  let inputValue = '';
  let communitiesFiltered : Community[] | undefined = [];

  $: {
		let inputValueLowered = inputValue.toLowerCase();
		communitiesFiltered = inputValueLowered ? $communities.data?.filter((e)=>
		e.description.toLowerCase().includes(inputValueLowered) ||
		e.name.toLowerCase().includes(inputValueLowered) ||
		e.state.toLowerCase().includes(inputValueLowered)
		) : $communities.data;
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
      <ErrorOnFetch 
        description="All the communities"
        error={$communities.error} 
      />
    {:else if !$communities.data || $communities.data.length === 0}
      <NoData text="You didn’t join any community yet" />
    {:else}
      {#if $communities.data?.length}
        <div class='w-90 mb-8 m-auto sm:ml-0 sm:w-80'>   
          <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input bind:value={inputValue} type="search" id="default-search" placeholder="Search communities..." required class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
          </div>
        </div>
      {/if}
      <ul>
        <CommunitiesList 
          data={communitiesFiltered} 
          joined={true} 
          grid="2"
        />
      </ul>
    {/if}
  </div>
</div>  
