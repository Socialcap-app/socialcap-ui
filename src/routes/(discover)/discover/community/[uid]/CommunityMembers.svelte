<script lang="ts">
	import { useGetMembers } from "$lib/hooks/members";
  // 
  import { Search } from 'flowbite-svelte';
  import MembersList from "$lib/components/members/MembersList.svelte";
  import { ErrorOnFetch } from "$lib/components";
	import LoadingSpinner from "$lib/components/common/LoadingSpinner.svelte";

  export let communityUid: string = "";

  let q: string = ""; // query 

  let members = useGetMembers(communityUid);

  function filterByName(data: any, name: string) {
    let uname = (name || "").toUpperCase();
    if (!uname) 
      return data;
    return (data || []).filter((t: any) => {
      return t.fullName.toUpperCase().includes(uname)
    })
  }
</script>

<div class="mx-auto">
  <div class="flex justify-end py-4 mb-4">
    <div class="w-48 lg:w-80">
      <Search class="text-gray-800 text-sm" autofocus placeholder="Search" size="md" bind:value={q} />
    </div>
  </div>

  <div class="border-t">
    {#if $members.isLoading}
    <LoadingSpinner />
    {:else if $members.isError}
      <ErrorOnFetch 
        description="My community"
        error={$members.error} 
      />
    {:else}
      <MembersList 
        data={filterByName($members.data, q)} 
      />
    {/if}
  </div>

</div>
