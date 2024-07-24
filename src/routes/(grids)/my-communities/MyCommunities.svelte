<script lang="ts">
  import { onMount } from "svelte";
  import { CACHE, type APIResponse } from "$lib/api";
  import { P, Select } from "flowbite-svelte";
  import { H1, H1Subtitle, ErrorOnFetch } from "$lib/components";
	import CommunitiesList from "$lib/components/communities/CommunitiesList.svelte";
  import { useGetMyCommunities } from "$lib/hooks/communities";
	import NoData from "$lib/components/common/NoData.svelte";
	import LoadingSpinner from "$lib/components/common/LoadingSpinner.svelte";
  
  const communities = useGetMyCommunities();
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
      <ul>
        <CommunitiesList 
          data={$communities.data} 
          joined={true} 
          grid="2"
        />
      </ul>
    {/if}
  </div>
</div>  
