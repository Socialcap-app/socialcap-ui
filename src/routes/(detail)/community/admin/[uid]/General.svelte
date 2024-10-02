<script lang="ts">
	import { Label, Input, Textarea, Helper, Toggle, Button } from 'flowbite-svelte';
	import { SubmitButton } from '$lib/components';
	import { useUpdateCommunity } from '$lib/hooks/communities';
	import { checkCommunityNameExist } from '$lib/api/communities-api';
	import { createForm } from 'felte';
	import { object, string, number } from 'yup';
	import { type Community } from '$lib/types';

	export let communityUid: string;
	export let community: Community;
	let original_name = community.name;
	let generateToken = true;
	const updateCommunityMutation = useUpdateCommunity(communityUid);
	// use it for updating button text when submitting
	$: working = $updateCommunityMutation.isPending ? 'Updating' : undefined;

	const schema = object({
		name: string()
			.required('Name is required')
			.max(128, 'Name must be at most 128 characters')
			.test('verified', 'Community name already exists', async (value) => {
				if (value === original_name) return true;
				const exist = await checkCommunityNameExist(value);
				return !exist as boolean;
			}),
		description: string().required('Description is required').max(128, 'Description must be at most 128 characters'),
		tokenId: string(),
		tokenMaxSupply: number(),
		tokenOwner: string(),
		tokenMasterAccount: string(),
		tokenSymbol: string()

		// isAdmin: boolean().default(false) TODO: ask about this
	});

	const { form, errors, isValid, touched, createSubmitHandler } = createForm({
		debounced: {
			timeout: 450,
			validate: async (values) => {
				console.log(values);
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
				tokenId: values.tokenId,
				tokenMasterAccount: values.tokenMasterAccount,
				tokenMaxSupply: values.tokenMaxSupply,
				tokenOwner: values.tokenOwner,
				tokenSymbol: values.tokenSymbol
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
			original_name = community.name;
		}
	});

	const generateCommunityToken = async () => {
		// Todo
	};
</script>

<!-- Example usage -->
<form
	use:form
	on:submit|stopPropagation|preventDefault
	class="m-auto flex flex-col gap-10 lg:max-w-md"
>
	<div>
		<Label for="name" class="text-base {$errors.name ? 'text-red-500' : ''}">Community Name</Label>
		<Input
			class="mt-2 text-base {$errors.name ? 'text-red-500' : ''}"
			type="text"
			id="name"
			name="name"
			placeholder=""
			required
			bind:value={community.name}
		/>
		{#if $errors.name && $touched.name}
			<span class="mt-2 text-sm text-red-500">{$errors.name}</span>
		{/if}
	</div>
	<div class="mt-2">
		<Label for="description" class="text-base {$errors.description ? 'text-red-500' : ''}"
			>Short Description<span class="float-right text-sm font-normal text-[#7E8390]"
				>Max. 128 char</span
			></Label
		>
		<Textarea
			class="mt-2 text-base {$errors.description ? 'text-red-500' : ''}"
			id="description"
			placeholder=""
			rows="4"
			name="description"
			bind:value={community.description}
		/>
		{#if $errors.description && $touched.description}
			<span class="mt-2 text-sm text-red-500">{$errors.description}</span>
		{/if}
	</div>
	<!-- <div class="space-y-3 border-b border-t border-gray-200 py-6">
		<p class="text-lg">Community token</p>
		<Helper class="mt-2 text-sm text-gray-500"
			>Set the community custom token fields or generate a new custom token for your community</Helper
		>
		<div class="flex flex-col justify-between space-y-3">
			<Label class="space-y-2" color={$errors.tokenId ? 'red' : 'gray'} for="votingStartsUTC">
				<div class="flex justify-between">
					<span>Token Id</span>
				</div>
				<Input
					class="mt-2 text-base {$errors.tokenId ? 'text-red-500' : ''}"
					type="text"
					id="tokenId"
					name="tokenId"
					placeholder=""
					bind:value={community.tokenId}
					disabled={generateToken}
				/>
			</Label>
			<Label class="space-y-2" color={$errors.votingEndsUTC ? 'red' : 'gray'} for="votingEndsUTC">
				<div class="flex justify-between">
					<span>Total Supply</span>
				</div>
				<Input
					class="mt-2 text-base {$errors.tokenMaxSupply ? 'text-red-500' : ''}"
					type="number"
					id="tokenMaxSupply"
					name="tokenMaxSupply"
					placeholder=""
					bind:value={community.tokenMaxSupply}
					disabled={generateToken}
				/>
			</Label>
			<Label class="space-y-2" color={$errors.tokenId ? 'red' : 'gray'} for="votingStartsUTC">
				<div class="flex justify-between">
					<span>Token Symbol</span>
				</div>
				<Input
					class="mt-2 text-base {$errors.tokenSymbol ? 'text-red-500' : ''}"
					type="text"
					id="tokenSymbol"
					name="tokenSymbol"
					placeholder=""
					bind:value={community.tokenSymbol}
					disabled={generateToken}
				/>
			</Label>
			<Label class="space-y-2" color={$errors.votingEndsUTC ? 'red' : 'gray'} for="votingEndsUTC">
				<div class="flex justify-between">
					<span>Token Owner</span>
				</div>
				<Input
					class="mt-2 text-base {$errors.tokenOwner ? 'text-red-500' : ''}"
					type="text"
					id="tokenOwner"
					name="tokenOwner"
					placeholder=""
					bind:value={community.tokenOwner}
					disabled
				/>
			</Label>
		</div>
		<Toggle name="generateToken" bind:checked={generateToken}>Generate Token</Toggle>
		<Button
			disabled={!generateToken}
			alternate
			color="light"
			on:click={() => generateCommunityToken()}>Generate Community Token</Button
		>
	</div> -->
	<SubmitButton
		on:click={(e) => {
			e.preventDefault();
			e.stopPropagation();
			submit();
		}}
		{working}
		disabled={!$isValid || $updateCommunityMutation.isPending}
		size="md"
		class="bg-sc_red px-3 hover:bg-sc_red lg:w-32"
	>
		Save Changes
	</SubmitButton>
</form>
