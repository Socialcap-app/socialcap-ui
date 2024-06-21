<script lang="ts">
	import {
		Alert,
		Select,
		DropdownItem,
		Helper,
		Input,
		Label,
		Textarea,
		Checkbox,
		ButtonGroup,
		InputAddon
	} from 'flowbite-svelte';
	import { createForm } from 'felte';
	import { array, boolean, date, number, object, string } from 'yup';
	import { onMount } from 'svelte';
	import type { Plan } from '$lib/types';
	import { DRAFT, PlanStates } from '$lib/types/states';
	import Datepicker from '$lib/components/common/Datepicker.svelte';
	import H1 from '$lib/components/common/H1.svelte';
	import { VariantOptions, SelectFromOptions, PayedBy } from '$lib/types';
	import { PayedByOptions } from '$lib/types/plan';

	export let plan: Plan;

	const schema = object({
		fee: number().required('Fee in MINA is required').min(0, 'Fee must be positive'),
		payedBy: number().required('Who payed is required'),
		communityShare: number()
			.required('Community share is required')
			.min(0, 'Community share must be positive'),
		protocolShare: number()
			.required('Protocol share is required')
			.min(0, 'Protocol share must be positive'),
		rewardsShare: number()
			.required('Validators reward share is required')
			.min(0, 'Validators reward share must be positive')
	});

	const { form, errors, isValid, touched, createSubmitHandler, validate } = createForm({
		initialValues: {
			fee: undefined,
			payedBy: undefined,
			communityShare: 30,
			protocolShare: 10,
			rewardsShare: 60
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

<div class="mx-auto max-w-xl">
	<form use:form on:submit|stopPropagation|preventDefault class="mx-6 mb-6 flex flex-col space-y-4">
		<div class="space-y-3 border-b border-gray-200 pb-6">
			<Label class="space-y-2" color={$errors.fee ? 'red' : 'gray'} for="fee">
				<div class="flex justify-between">
					<span>Fee (MINA)</span><span class="text-orange-400">Required</span>
				</div>
				<Input color={$errors.fee ? 'red' : 'base'} type="number" name="fee" required />
				{#if $errors.fee && $touched.fee}
					<span class="text-sm text-red-500">{$errors.fee}</span>
				{/if}
				<Helper class="mt-2 text-sm text-gray-500"
					>The fee in MINA required for this credential</Helper
				>
			</Label>
			<Label class="space-y-2" color={$errors.fee ? 'red' : 'gray'} for="payedBy">
				<div class="flex justify-between">
					<span>Payed By</span><span class="text-orange-400">Required</span>
				</div>
				<Select class="mt-2" items={PayedByOptions} name="payedBy" required />
				{#if $errors.payedBy && $touched.payedBy}
					<span class="text-sm text-red-500">{$errors.payedBy}</span>
				{/if}
				<Helper class="mt-2 text-sm text-gray-500"
					>The fee in MINA required for this credential</Helper
				>
			</Label>
		</div>
		<div class="flex flex-row justify-between space-x-3 border-b border-gray-200 pb-6">
			<Label class="space-y-2" color={$errors.rewardsShare ? 'red' : 'gray'} for="rewardsShare">
				<div class="flex justify-between">
					<span>Validator Rewards</span>
				</div>
				<ButtonGroup class="w-full">
					<Input
						color={$errors.rewardsShare ? 'red' : 'base'}
						type="number"
						name="rewardsShare"
						required
					/>
					<InputAddon>%</InputAddon>
				</ButtonGroup>
				{#if $errors.rewardsShare && $touched.rewardsShare}
					<span class="text-sm text-red-500">{$errors.rewardsShare}</span>
				{/if}
			</Label>
			<Label class="space-y-2" color={$errors.communityShare ? 'red' : 'gray'} for="communityShare">
				<div class="flex justify-between">
					<span>Community Share</span>
				</div>
				<ButtonGroup class="w-full">
					<Input
						color={$errors.communityShare ? 'red' : 'base'}
						type="number"
						name="communityShare"
						required
					/>
					<InputAddon>%</InputAddon>
				</ButtonGroup>
				{#if $errors.communityShare && $touched.communityShare}
					<span class="text-sm text-red-500">{$errors.communityShare}</span>
				{/if}
			</Label>
			<Label class="space-y-2" color={$errors.protocolShare ? 'red' : 'gray'} for="protocolShare">
				<div class="flex justify-between">
					<span>Protocol Share</span>
				</div>
				<ButtonGroup class="w-full">
					<Input
						color={$errors.protocolShare ? 'red' : 'base'}
						type="number"
						name="protocolShare"
						required
					/>
					<InputAddon>%</InputAddon>
				</ButtonGroup>
				{#if $errors.protocolShare && $touched.protocolShare}
					<span class="text-sm text-red-500">{$errors.protocolShare}</span>
				{/if}
			</Label>
		</div>
	</form>
</div>
