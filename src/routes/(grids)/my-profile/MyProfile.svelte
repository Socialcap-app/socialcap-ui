<script lang="ts">
    import { ErrorOnFetch } from "$lib/components";
    import { Badge }  from 'flowbite-svelte'
	  import Time from 'svelte-time';
	  import { SubmitButton } from '$lib/components';
    import  ProfileForm from './ProfileForm.svelte'
    import GradientAvatar from "$lib/components/common/GradientAvatar.svelte";
    import { getInitials, buildGradient } from "$lib/components/common/gradient-svg";
    import { CheckCircleOutline } from 'flowbite-svelte-icons';
    import { useGetProfile } from "$lib/hooks/persons";
    import NoData from "$lib/components/common/NoData.svelte";
    import { capitalizeFirstLetter } from "$lib/helpers/helpers";
    import type { Person } from '$lib/types/person';
	import LoadingSpinner from "$lib/components/common/LoadingSpinner.svelte";

    
    // TODO: add share button and his functionality
    // TODO: load image and add edit functionality
  
    const profile = useGetProfile();

    $: person = {
        uid: $profile.data?.uid,
        fullName: $profile.data?.fullName,
        email: $profile.data?.email,
        createdUTC: $profile.data?.createdUTC,
        approvedUTC: $profile.data?.approvedUTC,
        updatedUTC: $profile.data?.updatedUTC,
        accountId: $profile.data?.accountId,
        state: $profile.data?.state,
        description: $profile.data?.description,
        image: $profile.data?.image,
        phone: $profile.data?.phone,
        telegram: $profile.data?.telegram,
        preferences: $profile.data?.preferences
    } as Person

    $: initials = getInitials($profile.data?.fullName??"");

    $: { console.log("person ",person)}

    let editing = false;

    const startEdition = (e:MouseEvent) => {
      e.preventDefault()
      editing = true;
    }   
  
  </script>
  
  <div class="">  
    <div class="">
      {#if $profile.isLoading}
        <LoadingSpinner />
      {:else if $profile.isError}
        <ErrorOnFetch 
          description="Upps..."
          error={$profile.error} 
        />
      {:else if !$profile.data }
        <NoData text="Do You exist?" />
      {:else}
        <div class="relative flex flex-col items-center pb-72 lg:items-start">
            <div class="profile-back">
                <div class="avatar-container-mobile">
                    <GradientAvatar
                        gradient={buildGradient(initials,"xl")} 
                    />
                </div>
                <div class="avatar-container">
                    <GradientAvatar
                        gradient={buildGradient(initials,"xxl")} 
                    />
                </div>
            </div>
            <div class="mt-14 text-3xl text-black lg:ml-11 lg:pl-4 lg:mt-20">{$profile.data.fullName}
              {#if $profile.data.approvedUTC}
              <Badge class="bg-[#F9FBFC] ml-3 font-semibold py-0.5 px-2.5 text-xs max-lg:hidden" rounded color="dark">
                <CheckCircleOutline class="w-4 me-1.5" />Approved
              </Badge>
              {/if}
            </div>
            {#if !editing}
            <div class="flex mt-3 lg:hidden">
              {#if $profile.data.approvedUTC}
              <Badge class="bg-[#F9FBFC] mr-4 font-semibold py-0.5 px-2.5 text-xs"  rounded color="dark">
                <CheckCircleOutline class="w-4 me-1.5" />Approved
              </Badge>
              {/if}
              <Badge class="bg-[#B9CDFF] font-semibold text-primary-500 py-1 px-2.5 text-xs" rounded color="primary">{capitalizeFirstLetter($profile.data.state)}</Badge>
            </div>
            <SubmitButton size="md" class="absolute top-4 right-4 py-2 px-4 bg-sc_red hover:bg-sc_red lg:top-[298px] lg-right-0 lg:leading-normal" on:click={(e)=>startEdition(e)}>Edit</SubmitButton>         
            {/if}
            <div class="mt-9 text-base text-black font-normal lg:ml-11 lg:pl-4 lg:mt-1">Joined <Time format="YYYY" timestamp={$profile.data.createdUTC} /></div>            
            <div class="text-sm text-gray-400 font-normal lg:ml-11 lg:pl-4 lg:mt-6">Last update <Time format="hh" timestamp={$profile.data.updatedUTC} /> hours ago</div>     
            <div class="lg:pl-[60px] lg:w-full">
              <ProfileForm person = {person} {editing} on:save={()=>{editing = false}}/>
            </div>
            
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

    .avatar-container-mobile {
        position: relative;
        height: 88px;
        top:128px;
        border-radius: 50%;
        background-color:  rgba(255, 255, 255, 1);
        padding: 8px;
      }
      
    .avatar-container {
      position: relative;
      top:174px;
      border-radius: 50%;
      background-color:rgba(255, 255, 255, 1);
      display: none;
      margin-left: 44px;
      height: 136px;
      padding: 16px;
    }

    @media screen and (min-width: 1024px) {
      .profile-back {
        justify-content: start;
        height: 240px;
      }

      .avatar-container-mobile {
        display: none;
      }

      .avatar-container {
        display: block;
      }
    }
  </style>
  