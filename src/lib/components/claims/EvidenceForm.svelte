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

	export function hasErrors() {
		let thisFormHasErrors = false;
		fields.forEach((element: any) => {
			let thisInput = data[fields.indexOf(element)];
			if(thisInput.label && thisInput.required && (!thisInput.value || !thisInput.value.trim() || thisInput.value.length > thisInput.extras.max)){
				
				thisFormHasErrors=true;
				return;
			}
		});
		return thisFormHasErrors;
	}

	let fieldComponent;
	let dispatch = createEventDispatcher()

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
			let schema = string();  // definis schema
            // agrego condiciones al schema segun requerimientos
            if (field.required) {
                schema = schema.required(field.label + ' is required');
            }
            if (field.extras.max) {
                schema = schema.max(field.extras.max, field.label + ' must be less than ' + field.extras.max + ' words');
            }
            
            return schema;
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
				/* console.log(values); */
				await schema.validate(values, { abortEarly: false });
			} catch (err: any) {
				/* console.log(err.inner); */
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

	onMount(() => {
		// force validation on mount
		validate();
	});

	$: {
		// when isValid changes the event excecuted
		dispatch('validationChange', $isValid)
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
				bind:this={fieldComponent}
			/>
		{/each}
	</form>
</div>
