<script lang="ts">
    import { onMount } from "svelte";
    import { CACHE, type APIResponse } from "$lib/api";
    import { Select } from "flowbite-svelte";
    
    import { H1, H1Subtitle, ErrorOnFetch } from "$lib/components";
    import { Badge, Label, Input, Helper }  from 'flowbite-svelte'
	  import Time from 'svelte-time';
	  import { SubmitButton } from '$lib/components';
    import GradientAvatar from "$lib/components/common/GradientAvatar.svelte";
    import { getInitials, buildGradient } from "$lib/components/common/gradient-svg";
    import { CheckCircleOutline } from 'flowbite-svelte-icons';
	  import { createForm } from 'felte';
	  import { object, string } from 'yup';



    import { useGetProfile } from "$lib/hooks/persons";
    import NoData from "$lib/components/common/NoData.svelte";
    import { capitalizeFirstLetter } from "$lib/helpers/helpers";

    
    const profile = useGetProfile();

    $: initials = getInitials($profile.data?.fullName??"");

    let editing = false;

    const startEdition = (e:MouseEvent) => {
      e.preventDefault()
      editing = true;
    }

    const schema = object({
      name: string()
        .required('Name is required')
        .test('verified', 'Community name already exists', async (value) => {
          // if (value === original_name) return true
          const exist = await checkCommunityNameExist(value);
          return !exist as boolean;
        }),
      description: string().required('Description is required'),
      // isAdmin: boolean().default(false) TODO: ask about this
    });

    const { form, errors, isValid, touched, createSubmitHandler } = createForm({
      debounced: {
        timeout: 450, 
        validate: async (values) => {
          try {
            await schema.validate(values, { abortEarly: false });
          } catch (err: any) {
            const errors = err.inner.reduce(
              (res: any, value: any) => ({
                [value.path]: value.message,
                ...res
              }),
              {}
            );
            return errors;
          }
        }
      }
    });

    const saveProfile = (e:MouseEvent) => {
      e.preventDefault()
      editing = false;
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
            <form use:form on:submit|stopPropagation|preventDefault class="m-auto lg:max-w-md flex flex-col gap-10">
              <div>
                <Label for="name" class="{$errors.name ? "text-red-500" : "text-base"}">Full name or Alias</Label>
                <Input class="mt-2 {$errors.name ? "text-red-500" : "text-base"}" type="text" id="name" name="name" placeholder="" required />
                {#if $errors.name && $touched.name}
                <span class="mt-2 text-sm text-red-500">{$errors.name}</span>
                {:else}
                <Helper class="mt-2">Name or alias you would like to show in your profile</Helper>
                {/if}
              </div>
              <SubmitButton size="md" class="absolute top-4 right-4 py-2 px-4 bg-sc_red hover:bg-sc_red" on:click={(e)=>saveProfile(e)}>Save changes</SubmitButton>       
            </form>
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
  