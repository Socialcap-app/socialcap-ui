<script lang="ts">
  import StateBadge from '$lib/components/common/StateBadge.svelte';
	import { findState } from '$lib/types/states';
  import { Card, Badge, Avatar, Button, Img } from 'flowbite-svelte';
  import CommunityMenu from './CommunityMenu.svelte';
  import JoinCommunityModal from './JoinCommunityModal.svelte';
	import { goto } from '$app/navigation';
	import Banner from '../common/Banner.svelte';

  export let 
    uid = '', title = '', description = '', image = '',
    state = '', count = "0", nClaims = 0, nCredentials = 0,
    joined = false, isAdmin: boolean = false;

  let joinModalOpened = false;

  $: sts = findState((state === 'INITIAL') ? 'Revision' : state);
  const bgImage = image || '/images/community-banner.svg';

  function gotoLink(uid: string) {
    return joined 
      ? `/community/${uid}`
      : `/community/${uid}`;
  }

  function openJoinModal(ev: any) {
    ev.preventDefault();//.stopPropagation();
    joinModalOpened = true;
  }

  function updateImage(img: string) {
    image = img;
  }
</script>

<JoinCommunityModal 
  title={title}
  uid={uid}
  description={description}
  bind:open={joinModalOpened} 
/>

<Card class="" padding="none" size="none" href={gotoLink(uid)}>
  <Banner {image} on:updateimage={(e) => updateImage(e.detail.image)} inside="card"/>
  <div class="px-4 pt-6 pb-4">
    <!-- <Badge rounded border large color="green" class="inline-block mb-0">{state}</Badge> -->
    <div class="flex items-center justify-between">
      <StateBadge data={sts} />
      <div>
        <CommunityMenu {isAdmin} {joined}  on:admin={() => goto('/community/admin/' + uid)}/>
      </div>
    </div>
    <h6 class="mt-2 mb-2 text-xl font-bold text-blue-900 dark:text-white">{title}</h6>
    <p class="h-10 max-h-10 mb-6 text-sm text-gray-600 dark:text-gray-400 text-ellipsis overflow-hidden ">
      {description}
    </p>

    <div class="ms-0 mt-4 justify-between items-center flex rtl:space-x-reverse">
      {#if joined}
        <span class="inline-block text-sm font-bold">
          <Badge class="inline-block mb-0 py-1 bg-gray-200 rounded-full">
            { nClaims }
          </Badge> claims
        </span>
        <span class="inline-block text-sm font-bold">
          <Badge class="inline-block mb-0 py-1 bg-gray-200 rounded-full">
            { nCredentials }
          </Badge> issued
        </span>
      {/if}
      <div class="flex ms-4 items-center">
        <Avatar src="/images/gradient-lean.svg" stacked size="xs"/>
        <Avatar src="/images/gradient-mario.svg" stacked  size="xs"/>
        <Avatar src="/images/gradient-nicolas.svg" stacked  size="xs"/>
        <Avatar stacked size="xs" class="py-1 bg-gray-200 text-dark font-bold hover:bg-gray-600 text-xs w-10">
          +{Number(count) < 4 ? 0 : Number(count)-3} 
        </Avatar>       
      </div>      
      {#if !joined}
        <Button color="primary" size="sm" 
          on:click={(ev) => openJoinModal(ev)}>
          Join
        </Button>
      {/if}
    </div>                
  </div>
</Card>  
