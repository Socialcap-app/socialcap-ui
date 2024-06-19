<script lang="ts">
  import { Card,  Button } from 'flowbite-svelte';
  export let open = true;

</script>

{#if open}
<Card 
  class={`
    text-center border-0 shadow-xl p-9 bg-gradient-to-b from-white to-[#eff6ff] 
    lg:py-9 lg:px-10 lg:bg-cover lg:bg-[url('/images/bg-invite.png')]
  `} 
  size="none" padding="xl">
  <div class="flex flex-col items-center lg:items-start">
    <h6 class="text-2xl font-semibold text-black dark:text-white">Better together, invite friends</h6>
    <p class="mt-0.5 text-base font-normal text-gray-600 lg:text-base dark:text-gray-400">
      Invite teammates and create better communities
    </p>
    <div class="flex gap-4 mt-9 justify-center lg:mt-10 h-10">
      <Button size="sm" color="blue">Invite</Button>
      <Button size="sm" color="none"
        on:click={() => open = false} outline={false}>
        Dismiss
      </Button>
    </div>
  </div>
</Card>  

<br>
{/if}