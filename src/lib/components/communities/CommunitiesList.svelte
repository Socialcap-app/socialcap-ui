<script lang="ts">
  import { onMount } from 'svelte';
  import { P } from 'flowbite-svelte';
  import H1 from "$lib/components/common/H1.svelte";
  import CommunityCard from "./CommunityCard.svelte";
  import { type Community } from '$lib/types';
  import { getCurrentUser } from '$lib/store';
	import { userLoggedIn } from '$lib/store/navigation';
	
  export let 
    data: any[] = [], 
    joined = false,
    grid = ""; // 1 or 2 cols
  let user: any; 
  
  onMount(() => {
    
    user = $userLoggedIn ? getCurrentUser() : undefined;
  })

  function isAdmin(t: Community, user: any): boolean {
    if (!user) return false;
    const admins = [t.adminUid].concat(t.xadmins.split(','));
    return admins.includes(user.uid);
  }  
</script>

<div class="">
  <div class="w-full mt-0 mb-0">
    {#if grid==="1"}
      
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-1">
            {#each (data || []) as t}
                <div class=" transition-opacity duration-1000">
                  <CommunityCard 
                    uid={t.uid}
                    state={t.state}
                    title={t.name}      
                    description={t.description}
                    image={t.image}
                    nClaims={t.countClaims}
                    nCredentials={t.countCredentials}
                    count={t.countMembers}
                    joined={joined}
                    isAdmin={isAdmin(t, user)}
                  />
                </div>
            {/each}
        </div>
      {/if}
    {#if grid==="2"}
      
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {#each (data || []) as t}
            <div class=" transition-opacity duration-1000">
              <CommunityCard 
                uid={t.uid}
                state={t.state}
                title={t.name}      
                description={t.description}
                image={t.image}
                nClaims={t.countClaims}
                nCredentials={t.countCredentials}
                count={t.countMembers}
                joined={joined}
                isAdmin={isAdmin(t, user)}
              />
            </div>
          {/each}
        </div>
    {/if}
  </div>
</div>