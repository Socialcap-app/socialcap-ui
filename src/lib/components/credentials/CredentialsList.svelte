<script lang="ts">
  import { NoData } from "$lib/components";
	import type { Credential } from "$lib/types/credential";
  import CredentialCard from "./CredentialCard.svelte";
	
  export let 
    data: any[] = [],
    joined: boolean = false,
    isClaimable: boolean = false,
    grid = "1";

  let gridClass = "grid grid-cols-1 gap-4 lg:grid-cols-"+grid;  
  let selectedCredentialData: Credential;
  let open = false;
  let noData = {
    title: (isClaimable) 
      ? 'No credentials available' 
      : 'No issued credentials', 
      text: (isClaimable) 
        ? 'There are no credentials you can claim at this moment.\nCome back soon !'
        : 'We have not issued any credential yet.\nCome back soon !',
  }

  function openCardDetails(credential: any) {
    console.log('openCardDetails', credential);
    selectedCredentialData = credential;
    open = true;    
  }
</script>

<div class="">
  <div class="w-full --max-w-screen-lg mt-0 mb-0">
    {#if !data || !(data || []).length}
      <NoData
        title={noData.title}
        text={noData.text}
        buttons={false}
      />        
    {:else}
      <div class={gridClass}>
        {#each (data || []) as t}
          <div class="transition-opacity duration-1000" >
            <CredentialCard 
              data={t}
              {joined}
              {isClaimable}
            />
          </div>
        {/each}
      </div>
    {/if}  
  </div>
</div>