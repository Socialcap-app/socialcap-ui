<script lang="ts">
  import { Badge}  from 'flowbite-svelte'
  import GradientAvatar from "../common/GradientAvatar.svelte";
  import { getInitials, buildGradient } from "../common/gradient-svg";
	import ActionFooter from '../../../routes/(grids)/my-votes/ActionFooter.svelte';
  import { DotsVerticalOutline } from 'flowbite-svelte-icons';

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
  // TODO: translate to tailwind style
</script>

<div class="members-grid text-black flex items-center justify-between pt-3 pb-3 lg:border-b">
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
  <div class="roles">
    <Badge class="bg-white py-1 px-2.5" border rounded color="dark">Member</Badge>
    <Badge class="bg-white text-primary-500 py-1 px-2.5" border rounded color="primary">Admin</Badge>
  </div>
  <button class="w-5 justify-self-end"><DotsVerticalOutline/></button>
  
</div>
<style>
  .members-grid {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 1.5rem; /* Ajusta el espacio entre columnas como necesites */
  }

  .roles {
    grid-column-start: 3; /* Empuja el cuarto elemento a la tercera columna */
    grid-row-start: 2;
  }

  @media only screen and (min-width: 1200px) {  /* this on LG breakpoint */
    .members-grid  {
     grid-template-columns: auto auto 1fr auto auto;
    }

    .roles {
      grid-row-start: 1;
      grid-column-start: 4;
    }
}
</style>