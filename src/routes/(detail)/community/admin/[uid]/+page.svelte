<script lang="ts">
  import { onMount } from "svelte";
  import { MetaTag } from "$lib/components";
	import CommunityAdmin from "./CommunityAdmin.svelte";
  
  export let data: any;
  $: refreshOn = data.uid;//+Math.random();
  //const community = useGetCommunity(data.uid);
 
</script>

<MetaTag 
  path="/admin/community" 
  title="Socialcap" 
  subtitle="Admin Community" 
  description="" 
/>

<div>
  {#key refreshOn}
    <CommunityAdmin uid={data.uid} />
  {/key}
</div>

