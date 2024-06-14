<script lang="ts">
    import { Search } from 'flowbite-svelte';
	  import { useGetMembers } from "$lib/hooks/members";

    
    import { ErrorOnFetch } from "$lib/components";
    import MembersListAdmin from "$lib/components/members/MembersListAdmin.svelte";
    
    export let communityUid: string = "";

    let members = useGetMembers(communityUid);
    
    let q: string = ""; // query 

    function filterByName(data: any, name: string) {
        let uname = (name || "").toUpperCase();
        if (!uname) return data;
        return (data || []).filter((t: any) => {
            return t.fullName.toUpperCase().includes(uname)
        });
    }
</script>

<div class="mx-auto">
    <div class="flex justify-end py-4 mb-4">
      <div class="w-48 lg:w-80">
        <Search class="text-gray-800 text-sm" autofocus placeholder="Search" size="md" bind:value={q} />
      </div>
    </div>
  
    <div>
      {#if $members.isLoading}
        <span>Loading...</span>
      {:else if $members.isError}
        <ErrorOnFetch 
          description="My community"
          error={$members.error} 
        />
      {:else}
        <MembersListAdmin data={filterByName($members.data, q)} />
      {/if}
    </div>
  
  </div>