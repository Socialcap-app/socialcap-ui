<script lang="ts">
  import { NoData } from "$lib/components";
  import MemberItem from "./MemberItem.svelte";

  export let data: any[] = [];

  let gridClass = "";  
</script>

<div class="">
  <div class="w-full mt-0 mb-0">
    {#if !data || !(data || []).length}
      <NoData
        title='No members'
        text='There are no members in this community.\nCome back soon !'
        buttons={false}
      />        
    {:else}
      <div class="mt-2">
        {#each (data || []) as t }
          <div class="transition-opacity duration-1000">
            <MemberItem 
              fullName={t.fullName}
              uid={t.uid}
              personUid={t.personUid}
              isAdmin={t.isAdmin}
              role={t.role}
            />
          </div>
        {/each}
      </div>
    {/if}  
  </div>
</div>