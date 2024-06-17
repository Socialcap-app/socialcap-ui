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
	import H1 from '$lib/components/common/H1.svelte';
	import { VariantOptions, SelectFromOptions } from '$lib/types';

	export let plan: Plan;

	const schema = object({
		variant: string().required('Variant is required'),
		selection: string().required('Select from is required'),
		minValidators: number().required('Min Validators is required'),
		minVotes: number().required('Min Votes is required'),
		minPositives: number().required('Min Positives is required'),
		minAuditors: number().required('Min Auditors is required'),
		auditFrequency: number().required('Audit Frequency is required')
	});

	const { form, errors, isValid, touched, createSubmitHandler, validate } = createForm({
		initialValues: {
			variant: undefined,
			selection: undefined,
			minValidators: 0,
			minVotes: 0,
			minPositives: 0,
			minAuditors: 0,
			auditFrequency: 0
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
		}
	});

	onMount(() => {
		// force validation on mount
		// validate();
	});
</script>

<div class="max-w-xl mx-auto">
	<form use:form on:submit|stopPropagation|preventDefault class="mx-6 flex flex-col space-y-4">
		<div class="flex justify-between gap-2 ">
			<Label class="space-y-2 width-full" color={$errors.variant ? 'red' : 'gray'} for="variant">
				<div class="flex justify-between">
					<span>Variant</span>
				</div>
				<Select
					class="mt-2"
					items={VariantOptions.map((s) => ({ name: s.text, value: s.value }))}
					name="variant"
					required
				/>
				{#if $errors.variant && $touched.variant}
					<span class="text-sm text-red">{$errors.variant}</span>
				{/if}
			</Label>
			<Label class="space-y-2 width-full" color={$errors.selection ? 'red' : 'gray'} for="selection">
				<div class="flex justify-between">
					<span>Selected from</span>
				</div>
				<Select
					class="mt-2"
					items={SelectFromOptions.map((s) => ({ name: s.text, value: s.value }))}
					name="selection"
					required
				/>
				{#if $errors.selection && $touched.selection}
					<span class="text-sm text-red">{$errors.selection}</span>
				{/if}
			</Label>
		</div>
		<div class="flex flex-row justify-between space-x-3">
			<Label class="space-y-2" color={$errors.minValidators ? 'red' : 'gray'} for="minValidators">
				<div class="flex justify-between">
					<span>Min Validators</span>
				</div>
				<Input
					color={$errors.minValidators ? 'red' : 'base'}
					type="number"
					name="minValidators"
					
				/>
				{#if $errors.minValidators && $touched.minValidators}
					<span class="text-sm text-red">{$errors.minValidators}</span>
				{/if}
			</Label>
			<Label class="space-y-2" color={$errors.minVotes ? 'red' : 'gray'} for="minVotes">
				<div class="flex justify-between">
					<span>Min Votes</span>
				</div>
				<Input color={$errors.minVotes ? 'red' : 'base'} type="number" name="minVotes" required />
				{#if $errors.minVotes && $touched.minVotes}
					<span class="text-sm text-red">{$errors.minVotes}</span>
				{/if}
			</Label>
			<Label class="space-y-2" color={$errors.minPositives ? 'red' : 'gray'} for="minPositives">
				<div class="flex justify-between">
					<span>Min Positives</span>
				</div>
				<Input
					color={$errors.minPositives ? 'red' : 'base'}
					type="number"
					name="minPositives"
				
				/>
				{#if $errors.minPositives && $touched.minPositives}
					<span class="text-sm text-red">{$errors.minPositives}</span>
				{/if}
			</Label>
		</div>
		<div class="flex flex-row justify-between space-x-3">
			<Label class="space-y-2" color={$errors.minAuditors ? 'red' : 'gray'} for="minAuditors">
				<div class="flex justify-between">
					<span>Min Auditors</span>
				</div>
				<Input
					color={$errors.minAuditors ? 'red' : 'base'}
					type="number"
					name="minAuditors"
				
				/>
				{#if $errors.minAuditors && $touched.minAuditors}
					<span class="text-sm text-red">{$errors.minAuditors}</span>
				{/if}
			</Label>
			<Label class="space-y-2" color={$errors.auditFrequency ? 'red' : 'gray'} for="auditFrequency">
				<div class="flex justify-between">
					<span>Audit every</span>
				</div>
				<Input color={$errors.minVotes ? 'red' : 'base'} type="number" name="auditFrequency" />
				{#if $errors.auditFrequency && $touched.auditFrequency}
					<span class="text-sm text-red">{$errors.auditFrequency}</span>
				{/if}
			</Label>
		</div>
	</form>
</div>
