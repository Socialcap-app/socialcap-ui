<script lang="ts">
  import GradientAvatar from "../common/GradientAvatar.svelte";
  import { getInitials, buildGradient } from "../common/gradient-svg";
	import ActionFooter from '../../../routes/(grids)/my-votes/ActionFooter.svelte';

  export let 
    uid: string = "",
    personUid: string = "",
    fullName: string = "",
    role: string;
  
  $: initials = getInitials(fullName);

  // let screenWidth = window.innerWidth;
  // let gradientSize = screenWidth>1024?"lg":"md"
  
</script>
<div class="grid grid-cols-[auto_1fr_auto] lg:grid-cols-[auto_1fr_auto_auto] gap-x-6 gap-y-0.5 text-black flex items-center justify-between pt-3 pb-3 lg:border-b">
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
  <slot name="public"></slot>
  <slot name="admin"></slot>
</div>