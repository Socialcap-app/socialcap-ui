<script lang="ts">
	import { useCreateCommunity } from '$lib/hooks/communities';
	import { onMount } from 'svelte';
	import { Label, Input, Button, Modal, Checkbox, Helper } from 'flowbite-svelte';
	import { getCurrentUser } from '$lib/store';
	import type { User } from '$lib/types';
	import SubmitButton from '../common/SubmitButton.svelte';
	import CommunityCard from './CommunityCard.svelte';
	import { object, string, boolean } from 'yup';
	import { createForm, getValue } from 'felte';
	import { checkCommunityNameExist } from '$lib/api/communities-api';
	export let open = false;
	export let created = false;
	const schema = object({
		name: string()
			.required('Name is required')
			.max(128, 'Name must be at most 128 characters')
			.test('verified', 'Community name already exists', async (value, values) => {
				const exist = await checkCommunityNameExist(value);
				return !exist as boolean;
			}),
		description: string().required('Description is required').max(128, 'Description must be at most 128 characters'),
		acceptTac: boolean().required().default(false).oneOf([true], 'Field must be checked'),
		isAdmin: boolean().default(false)
	});

	const createCommunityMutation = useCreateCommunity();
	$: working = $createCommunityMutation.isPending ? 'Creating...' : '';
	let profile: User | null = getCurrentUser();

	const { form, errors, isValid, data, touched, createSubmitHandler } = createForm({
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
	});

	const submit = createSubmitHandler({
		onSubmit: async (values, context) => {
			console.log('submitting');
			await $createCommunityMutation.mutateAsync({
				name: values.name,
				description: values.description,
				adminUid: profile?.uid
			});
			created = true;
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
			created = true;
		}
	});

	onMount(() => {
		profile = getCurrentUser();
	});
</script>

<Modal bind:open size="md" autoclose class="w-full max-w-screen-lg">
	{#if !created}
		<div class="flex flex-col space-y-1">
			<h3 class="text-xl font-medium text-gray-900 dark:text-white">Create new community</h3>
			<h4 class="mb-5 text-sm font-normal text-gray-500 dark:text-gray-400">
				We’ll check the community registration before approving it.
			</h4>
		</div>
		<form use:form on:submit|stopPropagation|preventDefault class="mx-6 flex flex-col space-y-4">
			<Label for="name" class="space-y-2" color="{$errors.name ? "red" : "gray"}">
				<div class="flex justify-between">
					<span>Name</span><span class="text-orange-400">Required</span>
				</div>
				<Input color="{$errors.name ? "red" : "base"}" type="text" name="name" required />
				{#if $errors.name && $touched.name}
					<span class="text-sm text-red-500">{$errors.name}</span>
				{/if}
				<Helper class="mt-2 text-sm text-gray-500">Community name must be unique</Helper>
			</Label>
			<Label class="space-y-2" color="{$errors.description ? "red" : "gray"}" for="description">
				<div class="flex justify-between">
					<span>Description</span><span class="text-orange-400">Required</span>
				</div>
				<Input color="{$errors.description ? "red" : "base"}" type="text" name="description" required />
				{#if $errors.description && $touched.description}
					<span class="text-sm text-red-500">{$errors.description}</span>
				{/if}
				<Helper class="mt-2 text-sm text-gray-500">This description will be public</Helper>
			</Label>

			<Checkbox name="isAdmin">I am one of the administrator of this community</Checkbox>
			<Label class="items-baseline space-y-2">
				<Checkbox name="acceptTac"
					>Accept&nbsp;<a href="/"> Terms of Service</a>&nbsp;and&nbsp;<a href="/">Privacy Policy</a
					></Checkbox
				>
			</Label>
			<SubmitButton
				on:click={(e) => {
					e.preventDefault();
					e.stopPropagation();
					submit();
				}}
				{working}
				disabled={!$isValid || $createCommunityMutation.isPending}
				class="order-1 mb-2 mt-6 w-full md:order-2 md:mb-0 md:ms-2"
				size="lg"
			>
				Create
			</SubmitButton>
		</form>
	{:else}
		<div class="flex flex-col space-y-5">
			<div class="flex flex-col space-y-1 text-center">
				<h3 class="text-xl font-medium text-gray-900 dark:text-white">
					Your submission is pending to revision!
				</h3>
				<h4 class="mb-5 text-sm font-normal text-gray-500 dark:text-gray-400">
					We’ll send you an email when it’s ready
				</h4>
			</div>
			<CommunityCard
				title={getValue($data, 'name')}
				description={getValue($data, 'description')}
				state={'INITIAL'}
				joined={true}
			/>

			<Button
				on:click={() => {
					open = false;
				}}
				color="blue"
				size="lg"
				class="w-full text-sm font-bold"
			>
				Close
			</Button>
		</div>
	{/if}
</Modal>
