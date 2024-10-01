<script lang="ts">
	import { createCredentialOwnershipCheckTransaction, TXNFEE } from '$lib/transactions/credentials';
	import type { Plan } from '$lib/types';
	import type { Credential } from '$lib/types/credential';
	import { Alert, Button, Select, Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { derived, writable } from 'svelte/store';

	export let communityPlans: Plan[], // composite plans for this credential
		myCredentials: Credential[],
		aggregatedCredential: string[],
		value: string;
	let selectedCredential: string | undefined = undefined;
	let sender = '';
	// let selectValues = communityPlans.map((p) => ({ plan: p.name, credential: null })); // Todo change plan to mat to p.uid , need to update credential entity
	// console.log('selectValues', selectValues);
	let isWorking = false,
    isError = false,
    isConnected = false;
	function onCredentialSelectChange(e: any) {
		console.log('selected', e.target.value);
		selectedCredential = e.target.value;
	}

	onMount(async () => {
		isConnected = await isWalletConnected();
	});

	function isWalletAvailable() {
		return typeof (window as any).mina !== 'undefined';
	}

	async function isWalletConnected() {
		if (isWalletAvailable()) {
			const accounts: any[] = (await (window as any).mina?.getAccounts()) || [];
			if (accounts.length) {
				sender = accounts[0];
				return true;
			}
		}
		return false;
	}

	async function submit() {
		if (!selectedCredential) throw Error('Must select a issued credential');
		if (!sender) throw Error('There is no account to check credential ownership');
		isWorking = true;
		const serializedTxn = await createCredentialOwnershipCheckTransaction(
			selectedCredential,
			sender
		);
		console.log('serializedTxn: ', serializedTxn);
		
		let response = await (window as any).mina?.sendTransaction({
			transaction: serializedTxn, // serializedTxn,
			feePayer: {
				fee: TXNFEE,
				memo: `Check owner for Credential ${selectedCredential}`.substring(0, 32), // memo field in Txn
			}
		});

		let txnHash = response.hash;
		value = txnHash;  // check value to store
		isWorking = false;
	}
</script>

<div>
	<div class="space-y-2">
		{#each communityPlans.filter((p) => p.uid && aggregatedCredential.includes(p.uid)) as plan, index}
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
			disabled={isWorking || value}
			on:click={(e) => {
				e.preventDefault();
				e.stopPropagation();
				submit();
			}}
		>
			{#if isWorking}
				<Spinner class="me-3" size="4" color="red" />
				<code>Generating proof</code>
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
