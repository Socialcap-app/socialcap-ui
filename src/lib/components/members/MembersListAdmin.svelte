<script lang="ts">
  import { Badge}  from 'flowbite-svelte'
  import { NoData } from "$lib/components";
  import MemberItem from "./MemberItem.svelte";
  import MemberMenu from "./MemberMenu.svelte";
  import { Roles } from "$lib/types/member"
  import { capitalizeFirstLetter } from "$lib/helpers/helpers";
  import { type Member } from "$lib/types/member"

  export let 
    data: Member[] = [],
    communityUid:string = ""; 
  
  let admin_members: Member[] = [];
  let regular_members: Member[] = [];

  $: {
    let adminTemp: Member[]= [];
    let regularTemp: Member[] = [];
    data.forEach(member => {
      if (member.isAdmin) {
        adminTemp = [...adminTemp, member];
      } else {
        regularTemp = [...regularTemp, member];
      }
    });
    admin_members = adminTemp;
    regular_members = regularTemp;
  }

  // TODO: add some icon to indicate that is refereshing the role
  
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
      <div class="border-t mt-2">
        {#each (admin_members || []) as t (t.uid)}
          <div class="transition-opacity duration-1000">
            <MemberItem 
              fullName={t.fullName}
              uid={t.uid}
              personUid={t.uid}
              role={t.role}
            >
              <svelte:fragment slot="admin">
                <div class="roles col-start-3 row-start-2 lg:col-start-3 lg:row-start-1">
                  <Badge class="bg-white font-semibold text-gray-500 border-gray-500 py-1 px-2.5" border rounded >{capitalizeFirstLetter(Roles[t.role])}</Badge>
                  <Badge class="ml-2 lg:ml-6 bg-white font-semibold text-primary-500 py-1 px-2.5" border rounded color="primary">Admin</Badge>
                </div>
                <MemberMenu {communityUid} personUid={t.personUid} isAdmin={t.isAdmin} role={t.role} />
              </svelte:fragment>
            </MemberItem>
          </div>
        {/each}
      </div>
      <div class="lg:border-t mt-16">
        {#each (regular_members || []) as t (t.uid)}
          <div class="transition-opacity duration-1000">
            <MemberItem 
              fullName={t.fullName}
              uid={t.uid}
              personUid={t.uid}
              role={t.role}
            >
              <svelte:fragment slot="admin">
                <div class="roles col-start-3 row-start-2 lg:col-start-3 lg:row-start-1">
                  <Badge class="bg-white font-semibold text-gray-500 border-gray-500 py-1 px-2.5" border rounded color="dark">{capitalizeFirstLetter(Roles[t.role])}</Badge>
                </div>
                <MemberMenu {communityUid} personUid={t.personUid} isAdmin={t.isAdmin} role={t.role}/>
              </svelte:fragment>
            </MemberItem>
          </div>
        {/each}
      </div>
    {/if}  
  </div>
</div>