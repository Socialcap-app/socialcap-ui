<script lang="ts">
  import { onMount } from "svelte";
  import { P, A, Tabs, TabItem } from "flowbite-svelte";
  import { H1 } from "$lib/components";
  import CommunitiesList from "$lib/components/communities/CommunitiesList.svelte"
  import CredentialsList from "$lib/components/credentials/CredentialsList.svelte";
	import ErrorOnFetch from "$lib/components/common/ErrorOnFetch.svelte";
  import { useGetAllCommunities } from "$lib/hooks/communities";
	import { useGetAllClaimables } from "$lib/hooks/plans";
	import { ACTIVE } from "$lib/types/states";

  const communities =  useGetAllCommunities({ states: ["APPROVED"]});
  const claimables = useGetAllClaimables({});

  onMount(async () => { })

</script>

<div>
  <br/>
  <H1>For you</H1>

  <Tabs style="underline"
    contentClass="py-4 bg-transparent rounded-lg dark:bg-gray-800 mt-4">
    <TabItem open class="">
      <span slot="title" class="text-start sm:text-center">Claim & Earn</span>
      <div>
        {#if $claimables.isLoading}
          <span>Loading...</span>
        {:else if $claimables.isError}
          <ErrorOnFetch 
            description="All the claimables"
            error={$claimables.error} 
          />
        {:else}
          <ul>
            <CredentialsList 
              data={$claimables.data} 
              joined={false}
              isClaimable={true} 
            />
          </ul>
        {/if}
      </div>
    </TabItem>

    <TabItem>
      <span slot="title" class="">Join communities</span>
      <div>
      {#if $communities.isLoading}
        <span>Loading...</span>
      {:else if $communities.isError}
        <ErrorOnFetch 
          description="All the communities"
          error={$communities.error} 
        />
      {:else}
        <ul>
          <CommunitiesList 
            data={$communities.data} 
            joined={false} 
            grid="1"
          />
        </ul>
      {/if}
      </div>
    </TabItem>
  </Tabs>
</div>
