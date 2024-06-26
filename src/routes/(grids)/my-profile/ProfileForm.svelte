<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { Label, Input, Helper, Textarea }  from 'flowbite-svelte'
	  import { SubmitButton } from '$lib/components';
	  import { createForm } from 'felte';
    import { useUpdateProfile } from "$lib/hooks/persons";
    import * as yup from 'yup'; 
    import type { Person } from '$lib/types/person';

	  const updateProfileMutation = useUpdateProfile();

    const dispatch = createEventDispatcher();

    $: working = $updateProfileMutation.isPending ? 'Saving' : undefined;

    export let person: Person
    export let editing = false
    
    // TODO: improve validations
    const schema = yup.object({
      name: yup.string().required('Name is required'),
      email: yup.string().email().required('Email is required'),
      
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

    const submit = createSubmitHandler({
      onSubmit: async (values, context) => {
        await $updateProfileMutation.mutateAsync({
          uid: person.uid,
          fullName: values.name,
          email: values.email,
          description: values.description,
          accountId: values.minaccount, 
          telegram: values.telegramaccount,
          phone: values.phone
        } as Person);
      },
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
      },
      onSuccess: (response, context) => {
        dispatch('save')
      }
    });
</script>

<form use:form on:submit|stopPropagation|preventDefault class="mt-14 px-4 w-full flex flex-col gap-12 lg:border lg:py-8 lg:rounded-lg">
    <div class="lg:max-w-2xl w-full m-auto">
      <Label for="name" class="text-base text-black {$errors.name ? "text-red-500" : ""}">Full name or Alias<span class="float-right text-sm text-sc_red">Required</span></Label>
      <Input class="mt-2 text-sm text-black {$errors.name ? "text-red-500" : ""}" type="text" id="name" name="name" placeholder="Pablo Doe" disabled={editing?undefined:true} required bind:value={person.fullName} />
      {#if $errors.name && $touched.name}
      <span class="mt-2 text-sm text-red-500">{$errors.name}</span>
      {:else}
      <Helper class="mt-2 text-gray-400">Name or alias you would like to show in your profile</Helper>
      {/if}
    </div>
    <div class="lg:max-w-2xl w-full m-auto">
      <Label for="email" class="text-base text-black {$errors.email ? "text-red-500" : ""}">Email<span class="float-right text-sm text-sc_red">Required</span></Label>
      <Input class="mt-2 text-sm text-black {$errors.email ? "text-red-500" : ""}" type="text" id="email" name="email" placeholder="pablo.doe@gmail.com" disabled={editing?undefined:true} required bind:value={person.email} />
      {#if $errors.email && $touched.email}
      <span class="mt-2 text-sm text-red-500">{$errors.email}</span>
      {:else}
      <Helper class="mt-2 text-gray-400">We need it to contact you. We will never share it with others</Helper>
      {/if}
    </div>
    <div class="lg:max-w-2xl w-full m-auto">
      <Label for="description" class="text-base text-black {$errors.description ? "text-red-500" : ""}">Short bio<span class="max-lg:hidden float-right text-sm text-gray-400">Optional</span></Label>
          <Textarea class="mt-2 text-sm text-black {$errors.description ? "text-red-500" : ""}" id="description" placeholder="Tell us a bit about yourself" rows="4" name="description" maxlength="256" disabled={editing?undefined:true} bind:value={person.description} />
      {#if $errors.description && $touched.email}
      <span class="mt-2 text-sm text-red-500">{$errors.description}</span>
      {:else}
      <Helper class="mt-2 text-gray-400">A brief description about you that may be of interest to others</Helper>
      {/if}
    </div>
    <div class="lg:max-w-2xl w-full m-auto">
      <Label for="minaaccount" class="text-base text-black {$errors.minaaccount ? "text-red-500" : ""}">Your MINA account<span class="max-lg:hidden float-right text-sm text-gray-400">Optional</span></Label>
      <Input class="mt-2 text-sm text-black {$errors.minaaccount ? "text-red-500" : ""}" type="text" id="minaaccount" name="minaaccount" placeholder="B62qrYipbTfEx5GoJf99uU2iAcW2jgAvnoy1Wrj4Wee" disabled={editing?undefined:true} bind:value={person.accountId} />
      {#if $errors.minaaccount && $touched.minaaccount}
      <span class="mt-2 text-sm text-red-500">{$errors.minaaccount}</span>
      {:else}
      <Helper class="mt-2 text-gray-400">This is the MINA account you will use to pay for some services and sign transactions. We will never share it with others.</Helper>
      {/if}
    </div>
    <div class="lg:max-w-2xl w-full m-auto">
      <Label for="telegramaccount" class="text-base text-black {$errors.telegramaccount ? "text-red-500" : ""}">Telegram<span class="max-lg:hidden float-right text-sm text-gray-400">Optional</span></Label>
      <Input class="mt-2 text-sm text-black {$errors.telegramaccount ? "text-red-500" : ""}" type="text" id="telegramaccount" name="telegramaccount" placeholder="@" disabled={editing?undefined:true} bind:value={person.telegram} />
      {#if $errors.telegramaccount && $touched.telegramaccount}
      <span class="mt-2 text-sm text-red-500">{$errors.telegramaccount}</span>
      {:else}
      <Helper class="mt-2 text-gray-400">We may use it to contact you. We will never share it with others.</Helper>
      {/if}
    </div>
    <div class="lg:max-w-2xl w-full m-auto">
      <Label for="phone" class="text-base text-black {$errors.phone ? "text-red-500" : ""}">Phone<span class="max-lg:hidden float-right text-sm text-gray-400">Optional</span></Label>
      <Input class="mt-2 text-sm text-black {$errors.phone ? "text-red-500" : ""}" type="text" id="phone" name="phone" placeholder="444-444-444" disabled={editing?undefined:true} bind:value={person.phone} />
      {#if $errors.phone && $touched.phone}
      <span class="mt-2 text-sm text-red-500">{$errors.phone}</span>
      {:else}
      <Helper class="mt-2 text-gray-400">If available we may use it to secure your account. We will never share it with others.</Helper>
      {/if}
    </div>
    {#if editing}
    <SubmitButton size="md" class="absolute top-4 right-4 py-2 px-4 bg-sc_red hover:bg-sc_red lg:top-[298px] lg-right-0 lg:leading-normal" 
      on:click={(e)=>{
         e.preventDefault()
          e.stopPropagation()
          submit()
      }}
      {working}
      disabled={!$isValid || $updateProfileMutation.isPending}
    >Save changes</SubmitButton>      
    {/if} 
  </form>