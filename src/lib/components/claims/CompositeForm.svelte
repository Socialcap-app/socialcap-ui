<script lang="ts">
	import type { Plan } from '$lib/types';
	import type { Credential } from '$lib/types/credential';
	import { Alert, Button, Select, Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { derived, writable } from 'svelte/store';

	export let communityPlans: Plan[], // composite plans for this credential
		myCredentials: Credential[],
		aggregatedCredentials: string[],
		value: string;
	console.log('communty plans', communityPlans);
	console.log('my credentials', myCredentials);
	console.log('aggregatedCredentials', aggregatedCredentials);
	console.log('value', value);
	let selectValues = communityPlans.map((p) => ({ plan: p.name, credential: null })); // Todo change plan to mat to p.uid , need to update credential entity
	console.log('selectValues', selectValues);
    let working = '';
    
	function onCredentialSelectChange(e: any) {
		console.log('selected', e.target.value);
	}

    async function submit() {
        working = 'Generating proof'
        // todo call cloud worker
        working = ''
    }
</script>

<div>
	<div class="space-y-2">
		{#each communityPlans.filter((p) => p.uid && aggregatedCredentials.includes(p.uid)) as plan, index}
			<Select
				on:change={onCredentialSelectChange}
				id={plan.uid + '-composite-' + index}
				items={myCredentials
					.filter((x) => x.type === plan.name)
					.map((x) => ({ value: x.uid, name: x.type || 'Unknown' }))}
			/>
		{/each}
	</div>
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
				Generate Proof
			{/if}
		</Button>
	</div>
	{#if value && JSON.parse(value).verifiedProof}
		<Alert color="green">Verified Credentials</Alert>
	{/if}
</div>
<!-- {#if $allSelectsHaveValue}
    <div class="text-green-500">All selects have values.</div>
{:else}
    <div class="text-red-500">Please select values for all items.</div>
{/if} -->
