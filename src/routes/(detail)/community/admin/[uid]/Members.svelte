<script lang="ts">
    import { Search } from 'flowbite-svelte';
    
    import { ErrorOnFetch } from "$lib/components";
    import MembersListAdmin from "$lib/components/members/MembersListAdmin.svelte";

    export let members;  // TODO: ask.. paso los miembros por parametro desde acá? supongo que sí porque también uso la lista d xadmins
    export let xadmins:string = "";
    
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
  
    <div class="border-t">
        <MembersListAdmin 
          data={filterByName(members, q)} 
          {xadmins}
        />
    </div>
  
  </div>