<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Label, Input, Helper, Textarea } from 'flowbite-svelte';
	import { SubmitButton } from '$lib/components';
	import { createForm } from 'felte';
	import { useUpdateProfile } from '$lib/hooks/persons';
	import * as yup from 'yup';
	import type { IdentityCredential } from '$lib/types/identity';

	const updateProfileMutation = useUpdateProfile();

	const dispatch = createEventDispatcher();

	$: working = $updateProfileMutation.isPending ? 'Saving...' : undefined;

	export let identity: IdentityCredential;

	// TODO: improve validations
	const schema = yup.object({
		label: yup.string().required('Name is required'),
		pin: yup.string().required('Pin is required')
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
			// const identity = await Identity.create(values.label, values.pin);
			// console.log(identity);
			// Identity.create()
			// create identity hash
			// update profile with identity hash
			// download identity file
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
			dispatch('save');
		}
	});
</script>

<form
	use:form
	on:submit|stopPropagation|preventDefault
	class="mt-14 flex w-full flex-col gap-12 px-4 lg:rounded-lg lg:border lg:py-8"
>
	<div class="m-auto w-full lg:max-w-2xl">
		<Label for="label" class="text-base text-black {$errors.label ? 'text-red-500' : ''}"
			>Name or Alias<span class="float-right text-sm text-sc_red">Required</span></Label
		>
		<Input
			class="mt-2 text-sm text-black {$errors.label ? 'text-red-500' : ''}"
			type="text"
			id="label"
			name="label"
			placeholder="Pablo Doe"
			required
			bind:value={identity.label}
		/>
		{#if $errors.label && $touched.label}
			<span class="mt-2 text-sm text-red-500">{$errors.label}</span>
		{:else}
			<Helper class="mt-2 text-gray-400">Name or alias for your Identity</Helper>
		{/if}
	</div>
	<div class="m-auto w-full lg:max-w-2xl">
		<Label for="email" class="text-base text-black {$errors.pin ? 'text-red-500' : ''}"
			>Pin<span class="float-right text-sm text-sc_red">Required</span></Label
		>
		<Input
			class="mt-2 text-sm text-black {$errors.pin ? 'text-red-500' : ''}"
			type="text"
			id="pin"
			name="pin"
			placeholder="XXXXXX"
			required
			bind:value={identity.pin}
		/>
		{#if $errors.pin && $touched.pin}
			<span class="mt-2 text-sm text-red-500">{$errors.pin}</span>
		{:else}
			<Helper class="mt-2 text-gray-400"
				>A six digits pin number - do not share it with anyone</Helper
			>
		{/if}
	</div>
	<SubmitButton
		size="md"
		class="primary"
		on:click={(e) => {
			e.preventDefault();
			e.stopPropagation();
			submit();
		}}
		{working}
		disabled={!$isValid || $updateProfileMutation.isPending}>Create Identity</SubmitButton
	>
</form>
