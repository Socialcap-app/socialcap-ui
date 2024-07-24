<script lang="ts">
	import { useGetCommunityCredentials } from "$lib/hooks/credentials";
  // 
  import CredentialsList from "$lib/components/credentials/CredentialsList.svelte";
  import { ErrorOnFetch } from "$lib/components";
	import LoadingSpinner from "$lib/components/common/LoadingSpinner.svelte";

  export let communityUid: string = "";
  let issued = useGetCommunityCredentials(communityUid);
</script>

<div class="mx-auto">
  {#if $issued.isLoading}
  <LoadingSpinner />
  {:else if $issued.isError}
    <ErrorOnFetch 
      description="My community"
      error={$issued.error} 
    />
  {:else}
    <CredentialsList 
      data={$issued.data} 
      joined={true}
      isClaimable={false}
      grid="2" 
    />
  {/if}
</div>
