<script lang="ts">
	import { Select, Input, Textarea, Label, Helper, Checkbox, Tooltip } from 'flowbite-svelte';
	import {
		EvidenceTypeOptions,
		type NotaryType,
		type NotaryConfig,
		NotaryTypeOptions
	} from '$lib/types/plan';
	import Datepicker from '../common/Datepicker.svelte';
	import SubmitButton from '../common/SubmitButton.svelte';
	import { notarize_github, verify_notary_github } from '$lib/api/notaries-api';
	// import { verify } from 'zknotary-verifier'; 

	export { className as class };
	let className;

	export let notaryType: NotaryType, notaryConfig: NotaryConfig, value: string = "";
    notaryConfig = notaryConfig || { username: "", repo: "", since: new Date(), until: new Date() }
    async function submit() {

        // calling notarize
        console.log("calling notarize")
        console.log(notaryType, notaryConfig)
		const data = await notarize_github(notaryConfig);

		console.log("proofData github", data);
        const strData = JSON.stringify(data);
		
		console.log("calling verify notary github", strData);
		value = strData;
        // const verifiedData = await verify_notary_github(strData, import.meta.env.VITE_NOTARY_PUB_KEY);

        // console.log("verifiedData", verifiedData);
    }
</script>

<div>
	{#if notaryType == "github"}
		<div class="space-y-2">
			<Label for="notaryConfig.username" class="w-full text-base"
				><span>GitHub Username</span>
				<Input
					type="text"
					invalid={notaryConfig.username && !notaryConfig.username.trim()}
					bind:value={notaryConfig.username}
				/>
				<!-- <Helper class="mt-2 text-sm text-gray-500">We need an ID for this field</Helper> -->
			</Label>
			<Label for="notaryConfig.repo" class="w-full text-base"
				><span>Repository Name</span>
				<Input
					type="text"
					invalid={notaryConfig.repo && !notaryConfig.repo.trim()}
					bind:value={notaryConfig.repo}
				/>
				<!-- <Helper class="mt-2 text-sm text-gray-500">We need an ID for this field</Helper> -->
			</Label>
			<Label for="notaryConfig.since" class="w-full text-base"
				><span>Since Date</span>
				<Datepicker
					name="notaryConfig.since"
					datepickerFormat="mm-dd-yyyy"
					placeholder="Pick a date"
					bind:value={notaryConfig.since}
				/>
				<!-- <Helper class="mt-2 text-sm text-gray-500">We need an ID for this field</Helper> -->
			</Label>
			<Label for="notaryConfig.until" class="w-full text`-base"
				><span>Until Date</span>
				<Datepicker
					name="notaryConfig.until"
					datepickerFormat="mm-dd-yyyy"
					placeholder="Pick a date"
					bind:value={notaryConfig.until}
				/>
				<!-- <Helper class="mt-2 text-sm text-gray-500">We need an ID for this field</Helper> -->
			</Label>
		</div>
	{/if}
<div class="items-end">
	<SubmitButton
		on:click={(e) => {
			e.preventDefault();
			e.stopPropagation();
			submit();
		}}
		class="self-end mb-2 mt-2"
		size="md"
	>
		Notarize
	</SubmitButton>
</div>
</div>
