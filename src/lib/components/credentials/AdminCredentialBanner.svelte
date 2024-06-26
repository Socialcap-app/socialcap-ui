<script lang="ts">
  import {  Img } from 'flowbite-svelte';
  
  const defaultImage = "/images/community-banner.svg";
  export let image: string = "";
  export let inside = "page";

  /*
  Image sizes to make the banner look right:
  
  Full image: 2048x512 px, Aspect ratio: 0.25
  
  In page (all): 960x240 px => "w-full h-60"
  In card (mobile): 960x240 px => "w-full h-60"
  In card (desktop): 337x114 px => "w-full h-28"
  */
</script>

{#if inside === 'page'}
  <div class="relative bg-white mb-4 rounded-t-lg">
    <Img 
      src={image || defaultImage} 
      crossorigin={(image || "").includes('socialcap.') ? null : ""}
      class="max-h-60 w-full rounded-t-lg --shadow-xl"
    />
  </div>
{/if}

{#if inside === 'card'}
  <div class="relative bg-white mb-0 rounded-t-lg">
    <Img 
      src={image || defaultImage} 
      crossorigin={(image || "").includes('socialcap.') ? null : ""}
      class="max-h-48 lg:max-h-64 rounded-t-lg --shadow-xl"
    />
  </div>
{/if}

