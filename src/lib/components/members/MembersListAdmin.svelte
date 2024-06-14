<script lang="ts">
  import { Badge}  from 'flowbite-svelte'
  import { DotsVerticalOutline } from 'flowbite-svelte-icons';
  import { NoData } from "$lib/components";
  import MemberItem from "./MemberItem.svelte";
  import { Roles } from "$lib/types/member"

  export let data: any[] = []; 
  export let xadmins: string = ""  // TODO ask about admins.. seems to be emtpy

  $: admin_members = data.filter(member => xadmins.includes(member.uid))
  $: regular_members = data.filter(member => !xadmins.includes(member.uid))


  $: {console.log("data", data, xadmins, admin_members, regular_members);}

  // TODO: ask about where to put this function
  function capitalizeFirstLetter(text:string) {
    if (!text) return '';
    text = text.toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  let gridClass = "";  
  
  // TODO: fix gap between badges
</script>

<div class="">
  <div class="w-full mt-0 mb-0">
    {#if !data || !(data || []).length}
      <NoData
        title='No members'
        text='No members found.'
        buttons={false}
      />        
    {:else}
      <div class="mt-2">
        {#each (admin_members || []) as t}
          <div class="transition-opacity duration-1000">
            <MemberItem 
              fullName={t.fullName}
              uid={t.uid}
              personUid={t.uid}
              isFromAdmin={true}
              role={t.role}
            >
              <svelte:fragment slot="admin">
                <div class="roles col-start-3 row-start-2 lg:col-start-4 lg:row-start-1">
                  <Badge class="bg-white py-1 px-2.5" border rounded color="dark">{capitalizeFirstLetter(Roles[t.role])}</Badge>
                  <Badge class="bg-white text-primary-500 py-1 px-2.5" border rounded color="primary">Admin</Badge>
                </div>
                <button class="w-5 justify-self-end"><DotsVerticalOutline/></button>
              </svelte:fragment>
            </MemberItem>
          </div>
        {/each}
      </div>
      <div class="mt-16">
        {#each (regular_members || []) as t}
          <div class="transition-opacity duration-1000">
            <MemberItem 
              fullName={t.fullName}
              uid={t.uid}
              personUid={t.uid}
              isFromAdmin={true}
              role={t.role}
            >
              <svelte:fragment slot="admin">
                <div class="roles col-start-3 row-start-2 lg:col-start-4 lg:row-start-1">
                  <Badge class="bg-white py-1 px-2.5" border rounded color="dark">{capitalizeFirstLetter(Roles[t.role])}</Badge>
                </div>
                <button class="w-5 justify-self-end"><DotsVerticalOutline/></button>
              </svelte:fragment>
            </MemberItem>
          </div>
        {/each}
      </div>
    {/if}  
  </div>
</div>