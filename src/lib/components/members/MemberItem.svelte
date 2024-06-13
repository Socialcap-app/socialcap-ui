<script lang="ts">
  import Time from "svelte-time/Time.svelte";
  import GradientAvatar from "../common/GradientAvatar.svelte";
  import { getInitials, buildGradient } from "../common/gradient-svg";
	import { CompressOutline } from 'flowbite-svelte-icons';
	import ActionFooter from '../../../routes/(grids)/my-votes/ActionFooter.svelte';

  export let 
    uid: string = "",
    personUid: string = "",
    fullName: string = "",
    createdUTC: Date,
    role: string,
    isAdmin: boolean = false;
  
  $: initials = getInitials(fullName);

  // let screenWidth = window.innerWidth;
  // let gradientSize = screenWidth>1024?"lg":"md"
  
</script>

<div class="text-black flex items-center justify-between pt-3 pb-3 lg:border-b">
  <div class="flex justify-center lg:hidden">
    <GradientAvatar 
      initials={initials} 
      gradient={buildGradient(initials,"md")} 
      sizeClasses="w-6 h-6"
      fontClasses="leading-6 text-[10px]"
    />
  </div>
  <div class="flex justify-center max-lg:hidden">
    <GradientAvatar 
      initials={initials} 
      gradient={buildGradient(initials,"lg")} 
      sizeClasses="w-10 h-10"
      fontClasses="leading-10 text-base"
    />
  </div>
  <div class="w-full ms-4 text-base text-start">
    <a href={`/person/${personUid}`}>
      {fullName}
    </a>
  </div>
  <div class="text-sm font-semibold text-end">
    {personUid.slice(0,3)}...{personUid.slice(-3)}
  </div>
</div>