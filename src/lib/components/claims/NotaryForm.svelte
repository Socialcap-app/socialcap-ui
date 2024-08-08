<script lang="ts">
	import {
		Select,
		Input,
		Textarea,
		Label,
		Helper,
		Checkbox,
		Tooltip,
		Button,
		Spinner,
		Alert
	} from 'flowbite-svelte';
	import {
		EvidenceTypeOptions,
		type NotaryType,
		type NotaryConfig,
		NotaryTypeOptions
	} from '$lib/types/plan';
	import Datepicker from '../common/Datepicker.svelte';
	import { notarize_github, verify_notary_github } from '$lib/api/notaries-api';
	import * as wasm from 'zknotary-verifier';

	export { className as class };
	let className;

	export let notaryType: NotaryType,
		notaryConfig: NotaryConfig,
		value: string = '';
	notaryConfig = {
		...notaryConfig,
		since:  notaryConfig?.since ||  new Date(),
		until: notaryConfig?.until ||  new Date()
	};
	
	let working = '';
	async function submit() {
		try {
			working = 'Notarizing...';
			// calling notarize
			console.log('calling notarize');
			console.log(notaryType, notaryConfig);
			// Todo : call proper notary base on notaryType
			const data = await notarize_github(notaryConfig);

			console.log('proofData github', data);
			const strData = JSON.stringify(data);
			working = 'Verifying...';
			console.log('calling verify notary github with', strData);

			const verifiedData = await wasm.verify(strData, import.meta.env.VITE_NOTARY_PUB_KEY);

			console.log('verifiedData', verifiedData);
			value = JSON.stringify({
				...notaryConfig,
				proof: strData,
				verifiedProof: verifiedData
			});
			working = '';
		} catch (e) {
			console.log('error', e);
			working = '';
		}
	}
</script>

<div>
	{#if notaryType == 'github'}
		<div class="space-y-2">
			<Label for="notaryConfig.username" class="w-full text-sm"
				><span>GitHub Username</span>
				<Input
					type="text"
					invalid={notaryConfig.username && !notaryConfig.username.trim()}
					bind:value={notaryConfig.username}
					disabled={!!value}
				/>
				<!-- <Helper class="mt-2 text-sm text-gray-500">We need an ID for this field</Helper> -->
			</Label>
			<Label for="notaryConfig.repo" class="w-full text-sm"
				><span>Repository Name</span>
				<Input
					type="text"
					invalid={notaryConfig.repo && !notaryConfig.repo.trim()}
					bind:value={notaryConfig.repo}
					disabled={!!value}
				/>
				<!-- <Helper class="mt-2 text-sm text-gray-500">We need an ID for this field</Helper> -->
			</Label>
			<Label for="notaryConfig.since" class="w-full text-sm"
				><span>Since Date</span>
				<Datepicker
					name="notaryConfig.since"
					placeholder="Pick a date"
					bind:value={notaryConfig.since}
					disabled={!!value}
				/>
				<!-- <Helper class="mt-2 text-sm text-gray-500">We need an ID for this field</Helper> -->
			</Label>
			<Label for="notaryConfig.until" class="text-sm w-full"
				><span>Until Date</span>
				<Datepicker
					name="notaryConfig.until"
					placeholder="Pick a date"
					bind:value={notaryConfig.until}
					disabled={!!value}
				/>
				<!-- <Helper class="mt-2 text-sm text-gray-500">We need an ID for this field</Helper> -->
			</Label>
		</div>
	{/if}

	<div class="items-end">
		<Button
			size="md"
			color="alternative"
			class="mb-2 mt-2 self-end"
			disabled={working || value}
			on:click={(e) => {
				e.preventDefault();
				e.stopPropagation();
				submit();
			}}
		>
			{#if working}
				<Spinner class="me-3" size="4" color="red" />
				<code>{working || ''}</code>
				&nbsp;
			{:else}
				Notarize
			{/if}
		</Button>
	</div>
	{#if value && JSON.parse(value).verifiedProof}
		<Alert color="green">Verified Notary</Alert>
	{/if}
</div>
