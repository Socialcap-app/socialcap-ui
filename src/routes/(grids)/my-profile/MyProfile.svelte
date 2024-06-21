<script lang="ts">
    import { ErrorOnFetch } from "$lib/components";
    import { Badge, Label, Input, Helper, Textarea }  from 'flowbite-svelte'
	  import Time from 'svelte-time';
	  import { SubmitButton } from '$lib/components';
    import  ProfileForm from './ProfileForm.svelte'
    import GradientAvatar from "$lib/components/common/GradientAvatar.svelte";
    import { getInitials, buildGradient } from "$lib/components/common/gradient-svg";
    import { CheckCircleOutline } from 'flowbite-svelte-icons';
    import { useGetProfile } from "$lib/hooks/persons";
    import NoData from "$lib/components/common/NoData.svelte";
    import { capitalizeFirstLetter } from "$lib/helpers/helpers";
  	
    
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

    interface Person {
    uid: string
    fullName: string
    email: string
    createdUTC: Date
    approvedUTC: Date
    updatedUTC: Date
    accountId?: string
    state?: string
    description?: string
    image?: string
    phone?: string
    telegram?: string
    preferences?: string
}

  
  </script>
  
  <div class="">  
    <div class="">
      {#if $profile.isLoading}
        <span>Loading...</span>
      {:else if $profile.isError}
        <ErrorOnFetch 
          description="Upps..."
          error={$profile.error} 
        />
      {:else if !$profile.data }
        <NoData text="Do You exist?" />
      {:else}
        <div class="relative flex flex-col items-center pb-72">
            <div class="profile-back">
                <div class="avatar-container">
                    <GradientAvatar
                        gradient={buildGradient(initials,"xl")} 
                        sizeClasses="w-18 h-18"
                        fontClasses="leading-18 text-base"
                    />
                </div>
            </div>
            <div class="mt-14 text-3xl text-black">{$profile.data.fullName}</div>
            {#if !editing}
            <div class="flex mt-3">
              {#if $profile.data.approvedUTC}
              <Badge class="bg-[#F9FBFC] mr-4 font-semibold py-0.5 px-2.5 text-xs"  rounded color="dark">
                <CheckCircleOutline class="w-4 me-1.5" />Approved
              </Badge>
              {/if}
              <Badge class="lg:hidden lg:ml-6 bg-[#B9CDFF]  font-semibold text-primary-500 py-1 px-2.5 text-xs" rounded color="primary">{capitalizeFirstLetter($profile.data.state)}</Badge>
            </div>
            <div class="mt-9 text-base text-black font-normal">Joined <Time format="YYYY" timestamp={$profile.data.createdUTC} /></div>            
            <div class="text-sm text-gray-400 font-normal">Last update <Time format="hh" timestamp={$profile.data.updatedUTC} /> hour ago</div>     
            <SubmitButton size="md" class="absolute top-4 right-4 py-2 px-4 bg-sc_red hover:bg-sc_red" on:click={(e)=>startEdition(e)}>Edit</SubmitButton>       
            {:else}
              <ProfileForm person = {person} on:save={()=>{editing = false}}/>
            {/if}
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
  