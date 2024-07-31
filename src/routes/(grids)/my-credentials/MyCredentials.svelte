<script lang="ts">
  import { P } from "flowbite-svelte";
  import { H1, ErrorOnFetch } from "$lib/components";
	import CredentialsList from "$lib/components/credentials/CredentialsList.svelte";
  import { useGetMyCredentials } from "$lib/hooks/credentials";
	import LoadingSpinner from "$lib/components/common/LoadingSpinner.svelte";
  
  const credentials = useGetMyCredentials();
</script>

<div class="p-4">
  <H1>My Credentials</H1>
  <P class="text-gray-400" size="lg">
    You own {($credentials.data || []).length} credentials
  </P>
  <P class="pb-8"></P>
  {#if $credentials.isLoading}
    <LoadingSpinner />
  {:else if $credentials.isError}
    <ErrorOnFetch 
      description="All the credentials"
      error={$credentials.error} 
    />
  {:else}
    <ul>
      <CredentialsList 
        data={$credentials.data}
      />
    </ul>
  {/if}
</div>  
