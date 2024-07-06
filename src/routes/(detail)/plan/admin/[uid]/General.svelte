<script lang="ts">
	import {
		Alert,
		Select,
		DropdownItem,
		Helper,
		Input,
		Label,
		Textarea,
		Checkbox
	} from 'flowbite-svelte';
	import { createForm } from 'felte';
	import { array, boolean, date, number, object, string } from 'yup';
	import { onMount } from 'svelte';
	import type { Plan } from '$lib/types';
	import { DRAFT, PlanStates } from '$lib/types/states';
	import Datepicker from '$lib/components/common/Datepicker.svelte';
	export let plan: Plan;

	const schema = object({
		name: string().required('Name is required'),
		description: string().required('Description is required'),
		state: number().required('State is required'),
		expiration: number().required('Expiration is required'),
		total: number().required('Total to be issued is required'),
		startsUTC: string(),
		endsUTC: string(),
		votingStartsUTC: string(),
		votingEndsUTC: string(),
		metadata: string()
	});

	const { form, data, errors, isValid, touched, createSubmitHandler, validate } = createForm({
		initialValues: {
			name: plan.name,
			description: plan.description,
			state: plan.state,
			expiration: plan.expiration || 0,
			total: plan.total || 0,
			startsUTC: plan.startsUTC,
			endsUTC: plan.endsUTC,
			votingStartsUTC: plan.votingStartsUTC,
			votingEndsUTC: plan.votingEndsUTC,
			metadata: ''
		},
		validate: async (values) => {
			try {
				// update plan data
				values.state = Number(values.state)
				console.log("values", values, plan)
				plan = { ...plan, ...values };
				plan.evidence = ""
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

	onMount(() => {
		// force validation on mount
		// validate();
	});
</script>

<div class="mx-auto max-w-xl">
	<form use:form on:submit|stopPropagation|preventDefault class="mx-6 mb-6 flex flex-col space-y-4">
		<Label for="name" class="space-y-2 pb-6 border-b border-gray-200" color={$errors.name ? 'red' : 'gray'}>
			<div class="flex justify-between">
				<span>Name</span><span class="text-orange-400">Required</span>
			</div>
			<Input color={$errors.name ? 'red' : 'base'} type="text" name="name" required />
			{#if $errors.name && $touched.name}
				<span class="text-sm text-red-500">{$errors.name}</span>
			{/if}
		</Label>
		<Label class="space-y-2 pb-6 border-b border-gray-200" color={$errors.description ? 'red' : 'gray'} for="description">
			<div class="flex justify-between">
				<span>Description</span><span class="text-orange-400">Required</span>
			</div>
			<Textarea
				color={$errors.description ? 'red' : 'base'}
				type="text"
				name="description"
				required
			/>
			{#if $errors.description && $touched.description}
				<span class="text-sm text-red-500">{$errors.description}</span>
			{/if}
			<Helper class="mt-2 text-sm text-gray-500">Max 256 chars</Helper>
		</Label>
		<Label class="space-y-2 pb-6 border-b border-gray-200" color={$errors.state ? 'red' : 'gray'} for="state">
			<div class="flex justify-between">
				<span>State</span><span class="text-orange-400">Required</span>
			</div>
			<Select
				class="mt-2"
				items={PlanStates.map((s) => ({ name: s.name, value: s.value }))}
				name="state"
				required
			/>
			{#if $errors.state && $touched.state}
				<span class="text-sm text-red-500">{$errors.state}</span>
			{/if}
		</Label>
		<Label class="space-y-2 pb-6 border-b border-gray-200" color={$errors.expiration ? 'red' : 'gray'} for="expiration">
			<div class="flex justify-between">
				<span>Days for expiration</span><span class="text-orange-400">Required</span>
			</div>
			<Input color={$errors.expiration ? 'red' : 'base'} type="number" name="expiration" required />
			{#if $errors.expiration && $touched.expiration}
				<span class="text-sm text-red-500">{$errors.expiration}</span>
			{/if}
			<Helper class="mt-2 text-sm text-gray-500"
				>Days since issued when it must expire (or 0 for no expiration)</Helper
			>
		</Label>
		<Label class="space-y-2 pb-6 border-b border-gray-200" color={$errors.expiration ? 'red' : 'gray'} for="revocable">
			<Checkbox name="revocable">Revocable</Checkbox>
			<Helper class="mt-2 text-sm text-gray-500">Can this credential be revoked?</Helper>
		</Label>
		<Label class="space-y-2 pb-6 border-b border-gray-200" color={$errors.total ? 'red' : 'gray'} for="total">
			<div class="flex justify-between">
				<span>Total to be issued</span><span class="text-orange-400">Required</span>
			</div>
			<Input
				color={$errors.total ? 'red' : 'base'}
				type="number"
				name="total"
				required
			/>
			{#if $errors.total && $touched.total}
				<span class="text-sm text-red-500">{$errors.total}</span>
			{/if}
			<Helper class="mt-2 text-sm text-gray-500"
				>Max number of this credentials which can be claimed</Helper
			>
		</Label>
		<div class="space-y-3 pb-6 border-b border-gray-200">
			<p class="text-lg">Claiming phase</p>
			<div class="flex flex-row justify-between space-x-3">
				<Label class="space-y-2" color={$errors.startsUTC ? 'red' : 'gray'} for="startsUTC">
					<div class="flex justify-between">
						<span>Starts on</span>
					</div>
					<Datepicker name="startsUTC" placeholder="Pick a date" value={ $data.startsUTC}/>
					<Helper class="mt-2 text-sm text-gray-500"
						>Date when claiming of this credential can start</Helper
					>
				</Label>
				<Label class="space-y-2" color={$errors.endsUTC ? 'red' : 'gray'} for="endsUTC">
					<div class="flex justify-between">
						<span>Ends on</span>
					</div>
					<Datepicker name="endsUTC" placeholder="Pick a date"  value={ $data.endsUTC} />
					<Helper class="mt-2 text-sm text-gray-500"
						>Date when claiming of this credential ends</Helper
					>
				</Label>
			</div>
		</div>
		<div class="space-y-3 pb-6 border-b border-gray-200">
			<p class="text-lg">Voting phase</p>
			<div class="flex flex-row justify-between space-x-3">
				<Label
					class="space-y-2"
					color={$errors.votingStartsUTC ? 'red' : 'gray'}
					for="votingStartsUTC"
				>
					<div class="flex justify-between">
						<span>Starts on</span>
					</div>
					<Datepicker name="votingStartsUTC" placeholder="Pick a date"  value={ $data.votingStartsUTC}/>
					<Helper class="mt-2 text-sm text-gray-500"
						>Date when voting of this credential can start</Helper
					>
				</Label>
				<Label class="space-y-2" color={$errors.votingEndsUTC ? 'red' : 'gray'} for="votingEndsUTC">
					<div class="flex justify-between">
						<span>Ends on</span>
					</div>
					<Datepicker name="votingStartsUTC" placeholder="Pick a date"  value={ $data.votingEndsUTC}/>
					<Helper class="mt-2 text-sm text-gray-500"
						>Date when voting of this credential ends</Helper
					>
				</Label>
			</div>
		</div>
		<Label class="space-y-2" color={$errors.metadata ? 'red' : 'gray'} for="metadata">
			<div class="flex justify-between">
				<span>NFT Metadata</span>
			</div>
			<Textarea color={$errors.metadata ? 'red' : 'base'} type="text" name="metadata" required />
			{#if $errors.metadata && $touched.metadata}
				<span class="text-sm text-red-500">{$errors.metadata}</span>
			{/if}
			<Helper class="mt-2 text-sm text-gray-500"
				>Metadata to be used when minting, must be a JSON object</Helper
			>
		</Label>
	</form>
</div>
