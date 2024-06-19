<script lang="ts">
    import { onMount } from "svelte";
    import { CACHE, type APIResponse } from "$lib/api";
    import { P, Select } from "flowbite-svelte";
    import { H1, H1Subtitle, ErrorOnFetch } from "$lib/components";
	import { SubmitButton } from '$lib/components';
    import GradientAvatar from "$lib/components/common/GradientAvatar.svelte";
    import { getInitials, buildGradient } from "$lib/components/common/gradient-svg";

    import { useGetMyCommunities } from "$lib/hooks/communities";
    import NoData from "$lib/components/common/NoData.svelte";
    
    const communities = useGetMyCommunities();

    const fullName = "Eric"

    $: initials = getInitials(fullName);
  </script>
  
  <div class="">  
    <div class="">
      {#if $communities.isLoading}
        <span>Loading...</span>
      {:else if $communities.isError}
        <ErrorOnFetch 
          description="Upps..."
          error={$communities.error} 
        />
      {:else if !$communities.data || $communities.data.length === 0}
        <NoData text="Do You exist?" />
      {:else}
        <div class="relative flex flex-col items-center">
            <div class="profile-back">
                <div class="avatar-container">
                    <GradientAvatar
                        gradient={buildGradient(initials,"xl")} 
                        sizeClasses="w-18 h-18"
                        fontClasses="leading-18 text-base"
                    />
                </div>
            </div>
            <div class="mt-14 text-3xl text-black">Pablo Doe</div>
            <div class="">Status y Rol</div>
            <div class="mt-9 text-base text-black font-normal">Joined 2024</div>            
            <div class="text-sm text-gray-400 font-normal">Last update 1 hour ago</div>     
            <SubmitButton size="md" class="absolute top-4 right-4 py-2 px-4 bg-sc_red hover:bg-sc_red">Edit</SubmitButton>       
        </div>
      {/if}
    </div>
  </div>  
  <style>

    .profile-back {
        display: flex;
        height: 170px;
        width: 100%;
        background-color: rgba(249, 251, 252, 1);
        justify-content: center;
    }

    .avatar-container {
        position: relative;
        height: 88px;
        top:128px;
        border-radius: 50%;
        background-color: red; /* rgba(255, 255, 255, 1) */
        padding: 8px;
    }
  </style>
  