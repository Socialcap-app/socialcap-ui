<script lang="ts">
  import { onMount } from "svelte";
  import { MetaTag } from "$lib/components";
	import CommunityView from "./CommunityView.svelte";
  
  export let data: any;
  $: refreshOn = data.uid;//+Math.random();
  //const community = useGetCommunity(data.uid);
 
</script>

<MetaTag 
  path="community" 
  title="Socialcap" 
  subtitle={`Community`}
  description="" 
/>

<div class="p-4">
  {#key refreshOn}
    <CommunityView uid={data.uid} />
  {/key}
</div>
