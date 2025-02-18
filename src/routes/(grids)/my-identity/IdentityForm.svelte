<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Label, Input, Helper, Textarea, Button, Fileupload, Toggle } from 'flowbite-svelte';
	import { SubmitButton } from '$lib/components';
	import { createForm } from 'felte';
	import { useGetProfile, useUpdateProfile } from '$lib/hooks/persons';
	import * as yup from 'yup';
	import type { IdentityCredential } from '$lib/types/identity';
	import { Identity, postRequest } from '@socialcap/protocol-sdk';
	import { getIdentity, saveIdentity } from '$lib/store/identity';
	import { EyeOutline, EyeSlashOutline } from 'flowbite-svelte-icons';
	import { JsonView } from '@zerodevx/svelte-json-view/dist';
	const crytptoLib = window.crypto;
	const updateProfileMutation = useUpdateProfile();
	const profile = useGetProfile();
	const dispatch = createEventDispatcher();
	let seeDetails = false;

	$: working = $updateProfileMutation.isPending ? 'Saving...' : undefined;
	const identityStore = getIdentity();
	export let createIdentityRq: IdentityCredential;
	let identity: Identity = identityStore!;
	let showPin = false;
	// TODO: improve validations
	const schema = yup.object({
		label: yup.string().required('Name is required'),
		pin: yup
			.string()
			.matches(/^\d{6}$/, 'Pin must be exactly 6 digits')
			.required('Pin is required')
	});

	const { form, errors, isValid, touched, createSubmitHandler, setFields } = createForm({
		initialValues: {
			label: identityStore?.label ?? $profile.data?.fullName
		},
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

	const downloadIdentityFile = function () {
		if (!identity) return;
		const jsonStr = JSON.stringify(identity, null, 2); // Pretty-print JSON
		const blob = new Blob([jsonStr], { type: 'application/json' });
		const url = URL.createObjectURL(blob);

		// Create a temporary download link
		const a = document.createElement('a');
		a.href = url;
		a.download = 'data.json';
		document.body.appendChild(a);
		a.click();

		// Clean up
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const uploadIdentity = async () => {
		if (!createIdentityRq.file) return;
		try {
			const fileContent = await createIdentityRq.file.text(); // Read file as text
			const uploadedIdentity = JSON.parse(fileContent);
			// TODO: Validate the uploaded identity structure
			// modify Identity class on sdk to allow creating instance from JSON
			identity = new Identity(uploadedIdentity.label, uploadedIdentity.pin);

			// Assign remaining properties manually
			Object.assign(identity, uploadedIdentity);
			console.log("identity created", identity)
			setFields({ label: identity.label})
			saveIdentity(identity);
			dispatch('upload', identity);
		} catch (error) {
			console.error('Error uploading identity:', error);
		}
	};

	const submit = createSubmitHandler({
		onSubmit: async (values, context) => {
			identity = await Identity.create(values.label, values.pin);
			// json = identity;
			console.log(identity);
			// register identity
			let rsp1 = await postRequest('registerIdentity', {
				identity: createIdentityRq,
				pin: values.pin
			});
			// create identity hash
			// update profile with identity hash
			// enable download identity file
			// save identity on localstorage
			saveIdentity(identity);
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

	function handleFileChange(event: any) {
		console.log('event', event);
		createIdentityRq.file = event.target.files[0]; // Get the selected file
	}
</script>

<form use:form class="mx-auto max-w-2xl space-y-6 rounded-lg bg-white p-6 shadow-md">
	<div>
		<Label for="label" class="mb-2">Name or Alias <span class="text-red-500">*</span></Label>
		<Input
			type="text"
			id="label"
			name="label"
			placeholder="Pablo Doe"
			class={$errors.label && $touched.label ? '!border-red-500' : ''}
		/>
		{#if $errors.label && $touched.label}
			<Helper class="mt-2 text-red-500">{$errors.label}</Helper>
		{:else}
			<Helper>Name or alias for your Identity</Helper>
		{/if}
	</div>

	<div>
		<Label for="pin" class="mb-2">PIN <span class="text-red-500">*</span></Label>
		<Input
			type={showPin ? 'text' : 'password'}
			id="pin"
			name="pin"
			placeholder="XXXXXX"
			class={$errors.pin && $touched.pin ? '!border-red-500' : ''}
		>
			<span
				slot="right"
				class="cursor-pointer focus:outline-none"
				role="button"
				tabindex="0"
				on:click={() => (showPin = !showPin)}
				on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && (showPin = !showPin)}
			>
				<svelte:component this={showPin ? EyeOutline : EyeSlashOutline} class="h-5 w-5" />
			</span>
		</Input>
		{#if $errors.pin && $touched.pin}
			<Helper class="mt-2 text-red-500">{$errors.pin}</Helper>
		{:else}
			<Helper>A six-digit PIN number - do not share it with anyone</Helper>
		{/if}
	</div>
	<div class="flex flex-col space-y-4">
		<SubmitButton
			size="md"
			class="primary"
			on:click={(e) => {
				e.preventDefault();
				e.stopPropagation();
				submit();
			}}
			{working}
			disabled={!$isValid || $updateProfileMutation.isPending || !!identity}
			>Create Identity</SubmitButton
		>
	</div>
	<div>
		<Label class="mb-2">Upload your identity</Label>
		<Fileupload id="file" name="file" on:change={handleFileChange} />
		<Helper>JSON Identity File.</Helper>
	</div>

	<div class="flex flex-col space-y-4">
		<SubmitButton
			size="md"
			class="primary"
			on:click={(e) => {
				e.preventDefault();
				e.stopPropagation();
				uploadIdentity();
			}}
			{working}
			disabled={$updateProfileMutation.isPending || !createIdentityRq.file}
			>Upload Identity
		</SubmitButton>
		<Button color="light" on:click={downloadIdentityFile} disabled={!identity}>
			Download Identity
		</Button>
		<Toggle bind:checked={seeDetails} disabled={!identity}>See details</Toggle>

		{#if seeDetails}
			<div
				class="my-6 rounded-lg border border-neutral-300 bg-neutral-50 p-4 shadow-sm dark:border-neutral-600 dark:bg-neutral-800"
			>
				<h3
					class="mb-3 rounded-md bg-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300"
				>
					Identity JSON
				</h3>
				<pre class="overflow-auto rounded-md bg-gray-800 p-3 text-white">
					{JSON.stringify(identity, null, 2)}
				  </pre>
			</div>
		{/if}
	</div>
</form>
