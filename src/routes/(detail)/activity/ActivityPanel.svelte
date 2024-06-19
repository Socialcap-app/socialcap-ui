<script lang="ts">
  import { Search  } from 'flowbite-svelte';
  import { H1, H1Subtitle } from "$lib/components";
  import ActivitiesList from '$lib/components/activities/ActivitiesList.svelte';

  let q: string = ""; // query 
</script>

<div class="block w-full border-1 rounded px-4">
  <H1>
    Activity
  </H1>
  <H1Subtitle>
    All your activity
  </H1Subtitle>

  <div class="w-full flex items-center justify-between text-end py-4 mb-4">
    <div class="w-10/12">&nbsp;</div>
    <div class="w-5/12">
      <Search 
        class="inline-block text-gray-800 text-md" 
        autofocus 
        placeholder="Search" 
        size="md" 
        bind:value={q} 
      />
    </div>
  </div>

  <hr><br>
  <ActivitiesList limit={0} filter={q}/>
</div>  
