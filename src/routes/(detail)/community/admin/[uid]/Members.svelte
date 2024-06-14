<script lang="ts">
    import { Search } from 'flowbite-svelte';
    
    import { ErrorOnFetch } from "$lib/components";
    import MembersList from "$lib/components/members/MembersList.svelte";

    export let members;
    
    let q: string = ""; // query 

    function filterByName(data: any, name: string) {
        let uname = (name || "").toUpperCase();
        if (!uname) return data.map((member:any) => {return  {...member, personUid:member.uid}});
        return (data || []).filter((t: any) => {
            return t.fullName.toUpperCase().includes(uname)
        }).map((member:any) => {return  {...member, personUid:member.uid}});
    }
</script>

<div class="mx-auto">
    <div class="flex justify-end py-4 mb-4">
      <div class="w-48 lg:w-80">
        <Search class="text-gray-800 text-sm" autofocus placeholder="Search" size="md" bind:value={q} />
      </div>
    </div>
  
    <div class="border-t">
        <MembersList 
          data={filterByName(members, q)} 
        />
    </div>
  
  </div>