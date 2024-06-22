<script lang="ts">
  import type { Community } from "$lib/types";
  // 
  import Time from 'svelte-time';
  import { Button, Badge } from 'flowbite-svelte';
  import { ForwardOutline, CheckOutline } from "flowbite-svelte-icons";
  import CommunityMenu from "$lib/components/communities/CommunityMenu.svelte";
	import JoinCommunityModal from "$lib/components/communities/JoinCommunityModal.svelte";
	import { goto } from "$app/navigation";

  export let community: Community | undefined | null;

  let joinModalOpened = false;

  function openJoinModal(ev: any) {
    ev.preventDefault();//.stopPropagation();
    joinModalOpened = true;
  }
</script>

<JoinCommunityModal 
  title={community?.name}
  uid={community?.uid}
  description={community?.description}
  bind:open={joinModalOpened} 
/>

<div class="flex items-center space-x-1">
  <!-- 
    <Button size="md" color="light" class="!p-2 --bg-orange-500 --text-white"><EditSolid  class="w-6 h-6" /></Button> 
  -->
  <Button size="md" color="light" class="p-2 px-4">
    Share <ForwardOutline class="ms-2 w-5 h-5" />
  </Button> 

  {#if !(community?.isMember === '1')}
    <Button 
      on:click={(ev) => openJoinModal(ev)}
      size="md" color="blue" class="p-2 px-4 text-sm">
      Join
    </Button> 
  {/if}
  
  {#if (community?.isMember === '1') && !community?.isAdmin}
    <CommunityMenu 
      isAdmin={community?.isAdmin}
      joined={community?.isMember === '1'}
      on:admin={() => goto('/community/admin/' + community?.uid)}>
        <Badge color="light" large class="text-primary-500 border m-0 !py-2 rounded-lg">
          <CheckOutline class="ms-0 w-5 h-5"/>
          Joined
        </Badge>
    </CommunityMenu>  
  {/if}
  
  {#if community?.isAdmin}
    <CommunityMenu 
      isAdmin={community?.isAdmin}
      joined={community?.isMember === '1'}
      on:admin={() => goto('/community/admin/' + community?.uid)}
      >
        <Button size="md" class="bg-orange-500 p-2 px-4">
           Admin
        </Button> 
    </CommunityMenu>  
  {/if}

</div>
