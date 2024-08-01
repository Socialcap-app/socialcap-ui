<script lang="ts">
	import EvidenceField from './EvidenceField.svelte';
	import { Alert } from 'flowbite-svelte';
	import { createForm } from 'felte';
	import { array, object, string } from 'yup';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Plan } from '$lib/types';
	import { type Credential } from '$lib/types/credential';

	export let eform: any,
		data: any,
		communityUid: string, // this is the data for this MasterPlan and empty Claim
		communityPlans: Plan[] = [],
		myCredentials: Credential[] = [];

	let existingErrors : string[] = [];

	const dispatch = createEventDispatcher();

	function camelize(str: string) {
		return str
			.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
				return index === 0 ? word.toLowerCase() : word.toUpperCase();
			})
			.replace(/\s+/g, '');
	}

	interface IField {
		name: string;
		label: string;
		initialValue: any;
		schemaType: any;
		type: string;
		required: boolean;
		sid: string;
		description: string;
		extras: any;
	}
	function getFieldSchema(field: IField) {
		if (field.type === 'text' || field.type === 'note') {
			return field.required ? string().required(field.label + ' is required') : string();
		}

		if (field.type === 'checks') {
			return field.required
				? array().of(string()).min(1, 'At least one option must be selected')
				: array();
		}

		if (field.type === 'tags') {
			return field.required
				? array()
						.of(string())
						.min(1, field.label + ' is required')
				: array();
		}

		if (field.type === 'links') {
			return field.required
				? array()
						.of(string())
						.min(1, field.label + ' is required')
				: array();
		}

		if (field.type === 'notarize') {
			return field.required ? string().required(field.label + ' is required') : string();
		}

		if (field.type === 'radio') {
			return field.required ? string().required('One option must be selected') : string();
		}
	}

	const fields = eform.map((field: any) => ({
		name: camelize(field.type + '_' + field.label),
		sid: field.sid && field.sid !== '' ? field.sid : camelize(field.type + '_' + field.label),
		initialValue: '',
		schemaType: getFieldSchema(field),
		description: field.description,
		extras: field.extras,
		label: field.label,
		type: field.type,
		required: field.required
	}));

	const schemaObject = Object.fromEntries(
		fields.map((field: IField) => [field.name, field.schemaType])
	);

	const schema = object().shape(schemaObject);
	const { form, errors, isValid, touched, createSubmitHandler, validate } = createForm({
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
				/* 
				console.log(errors) ---> {"text_ll": "ll is required"} 
				*/
				return errors;
			}
		}
	});

	const isFormSubmittable = ({detail}: any/* { dataValue: string } */) => {
		console.log(!!detail.dataValue)
		if(detail.dataValue){
			existingErrors = existingErrors.filter((e)=>e!==detail.label)
		};
		if(!detail.dataValue){
			if(!existingErrors.find((e)=>e==detail.label))
			existingErrors.push(detail.label)
		};
		existingErrors = existingErrors;
	};

	onMount(() => {
		// force validation on mount
		validate();
	});

	$:{
		dispatch('existingErrors', {
			existingErrors
			})
	}
</script>

<div class="">
	<Alert
		dismissable
		class="-mx-4 mb-8 rounded-lg bg-gray-200 px-4 pb-3 pt-4 text-sm leading-relaxed text-blue-900"
	>
		Please provide below the required evidence to sustain your claim. This evidence will be deleted
		as soon as the claim has been approved, so no personal or private data will be stored and kept.
	</Alert>

	<form use:form on:submit|stopPropagation|preventDefault class="mx-10 flex flex-col space-y-4">
		{#each fields || [] as field, index}
			<EvidenceField
				{errors}
				{touched}
				{field}
				{index}
				bind:data
				{myCredentials}
				{communityPlans}
				on:changeRequired={(val) => isFormSubmittable(val)}
			/>
		{/each}
	</form>
</div>
