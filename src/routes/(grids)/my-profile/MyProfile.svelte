<script lang="ts">
    import { onMount } from "svelte";
    import { CACHE, type APIResponse } from "$lib/api";
    import { Select } from "flowbite-svelte";
    
    import { H1, H1Subtitle, ErrorOnFetch } from "$lib/components";
    import { Badge, Label, Input, Helper, Textarea }  from 'flowbite-svelte'
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

    let editing = true;

    const startEdition = (e:MouseEvent) => {
      e.preventDefault()
      editing = true;
    }

    const schema = object({
      name: string()
        .required('Name is required'),
        /*
        .test('verified', 'Community name already exists', async (value) => {
          // if (value === original_name) return true
          const exist = await checkCommunityNameExist(value);
          return !exist as boolean;
        }),*/
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
            <form use:form on:submit|stopPropagation|preventDefault class="mt-14 px-4 w-full flex flex-col gap-12">
              <div>
                <Label for="name" class="text-base text-black {$errors.name ? "text-red-500" : ""}">Full name or Alias</Label>
                <Input class="mt-2 text-sm text-black {$errors.name ? "text-red-500" : ""}" type="text" id="name" name="name" placeholder="Pablo Doe" required />
                {#if $errors.name && $touched.name}
                <span class="mt-2 text-sm text-red-500">{$errors.name}</span>
                {:else}
                <Helper class="mt-2 text-gray-400">Name or alias you would like to show in your profile</Helper>
                {/if}
              </div>
              <div>
                <Label for="email" class="text-base text-black {$errors.email ? "text-red-500" : ""}">Email</Label>
                <Input class="mt-2 text-sm text-black {$errors.email ? "text-red-500" : ""}" type="text" id="email" name="email" placeholder="pablo.doe@gmail.com" required />
                {#if $errors.email && $touched.email}
                <span class="mt-2 text-sm text-red-500">{$errors.email}</span>
                {:else}
                <Helper class="mt-2 text-gray-400">We need it to contact you. We will never share it with others</Helper>
                {/if}
              </div>
              <div>
                <Label for="description" class="text-base text-black {$errors.description ? "text-red-500" : ""}">Short bio</Label>
		            <Textarea class="mt-2 text-sm text-black {$errors.description ? "text-red-500" : ""}" id="description" placeholder="Tell us a bit about yourself" rows="4" name="description" maxlength="256" />
                {#if $errors.description && $touched.email}
                <span class="mt-2 text-sm text-red-500">{$errors.description}</span>
                {:else}
                <Helper class="mt-2 text-gray-400">A brief description about you that may be of interest to others</Helper>
                {/if}
              </div>
              <div>
                <Label for="minaaccount" class="text-base text-black {$errors.minaaccount ? "text-red-500" : ""}">Your MINA account</Label>
                <Input class="mt-2 text-sm text-black {$errors.minaaccount ? "text-red-500" : ""}" type="text" id="minaaccount" name="minaaccount" placeholder="B62qrYipbTfEx5GoJf99uU2iAcW2jgAvnoy1Wrj4Wee" required />
                {#if $errors.minaaccount && $touched.minaaccount}
                <span class="mt-2 text-sm text-red-500">{$errors.minaaccount}</span>
                {:else}
                <Helper class="mt-2 text-gray-400">This is the MINA account you will use to pay for some services and sign transactions. We will never share it with others.</Helper>
                {/if}
              </div>
              <div>
                <Label for="telegramaccount" class="text-base text-black {$errors.telegramaccount ? "text-red-500" : ""}">Telegram</Label>
                <Input class="mt-2 text-sm text-black {$errors.telegramaccount ? "text-red-500" : ""}" type="text" id="telegramaccount" name="telegramaccount" placeholder="@" required />
                {#if $errors.telegramaccount && $touched.telegramaccount}
                <span class="mt-2 text-sm text-red-500">{$errors.telegramaccount}</span>
                {:else}
                <Helper class="mt-2 text-gray-400">We may use it to contact you. We will never share it with others.</Helper>
                {/if}
              </div>
              <div>
                <Label for="phone" class="text-base text-black {$errors.phone ? "text-red-500" : ""}">Phone</Label>
                <Input class="mt-2 text-sm text-black {$errors.phone ? "text-red-500" : ""}" type="text" id="phone" name="phone" placeholder="444-444-444" required />
                {#if $errors.phone && $touched.phone}
                <span class="mt-2 text-sm text-red-500">{$errors.phone}</span>
                {:else}
                <Helper class="mt-2 text-gray-400">If available we may use it to secure your account. We will never share it with others.</Helper>
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
  