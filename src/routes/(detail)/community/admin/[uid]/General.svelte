<script lang="ts">
  	import { Label, Input, Textarea, Helper } from "flowbite-svelte";
	import { SubmitButton } from '$lib/components';
	import { useUpdateCommunity } from '$lib/hooks/communities';
	import { checkCommunityNameExist } from '$lib/api/communities-api';
	import { createForm, getValue } from 'felte';
	import { object, string, boolean } from 'yup';
	import { createEventDispatcher } from 'svelte';
	export let communityUid: string;
	export let name: string;
	export let description: string;
	const original_name = name;

	const updateCommunityMutation = useUpdateCommunity();
	// use it for updating button text when submitting
	$: working = $updateCommunityMutation.isPending ? 'Updating' : '';

	const dispatch = createEventDispatcher();

	const schema = object({
		name: string()
			.required('Name is required')
			.test('verified', 'Community name already exists', async (value) => {
				if (value === original_name) return true
				const exist = await checkCommunityNameExist(value);
				return !exist as boolean;
			}),
		description: string().required('Description is required'),
		// isAdmin: boolean().default(false) TODO: ask about this
	});

	const { form, errors, isValid, data, touched, createSubmitHandler } = createForm({
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
			await $updateCommunityMutation.mutateAsync({
				uid: communityUid,
				name: values.name,
				description: values.description,
			});
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
			console.log('succcess');
			dispatch('update')
		}
	});
</script>

<!-- Example usage -->
<form use:form on:submit|stopPropagation|preventDefault class="m-auto lg:max-w-md flex flex-col gap-10">

    <div>
    	<Label for="name" class="{$errors.name ? "text-red-500" : "text-base"}">Community Name</Label>
			<Input class="mt-2 {$errors.name ? "text-red-500" : "text-base"}" type="text" id="name" name="name" placeholder="" required bind:value={name}/>
			{#if $errors.name && $touched.name}
				<span class="mt-2 text-sm text-red-500">{$errors.name}</span>
			{/if}
    </div>
	<div class="mt-2">
		<Label for="description" class="{$errors.description ? "text-red-500" : "text-base"}">Short Description<span class="float-right text-sm font-normal text-[#7E8390]">Max. 256 char</span></Label>
		<Textarea class="mt-2 {$errors.description ? "text-red-500" : "text-base"}" id="description" placeholder="" rows="4" name="description" maxlength="256" bind:value={description}/>
		{#if $errors.description && $touched.description}
			<span class="mt-2 text-sm text-red-500">{$errors.description}</span>
		{/if}
	</div>
	<SubmitButton
		on:click={(e) => {
			e.preventDefault();
			e.stopPropagation();
			submit();
		}}
		{working}
		disabled={!$isValid || $updateCommunityMutation.isPending}
		size="md"
		class="px-3 lg:w-32 bg-sc_red hover:bg-sc_red"
	>
		Save Changes
	</SubmitButton>
</form>