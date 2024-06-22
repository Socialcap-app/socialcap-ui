<script lang="ts">
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import { Button, Badge, Spinner } from 'flowbite-svelte';
	import Time from 'svelte-time/Time.svelte';
	import { type Task } from '$lib/types/task';
	import { getCurrentBlockchain } from '$lib/store';
	import { useSubmitBatchTasks } from '$lib/hooks/tasks';
	import { Poseidon, MerkleTree, PublicKey, Field } from 'o1js';
	import { UID } from '$lib/types/uid';

	const dispatch = createEventDispatcher();
	let submitBatchTasks = useSubmitBatchTasks();

	export let votes: Task[];

	let isWorking = false,
		isError = false,
		isConnected = false;
	let payer = '';
	let errorMessage = '';

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
				payer = accounts[0];
				return true;
			}
		}
		return false;
	}
	function buildMerkleTree(tasks: Task[], electorId: string) {
		let tree = new MerkleTree(10); // max of 1024 leafs

		// each task:
		// {
		//   uid: t.uid,
		//   claimUid: t.claimUid,
		//   result: t.result,
		//   assigneeUid: t.assigneeUid,
		//   communityUid: t.community.uid,
		//   planUid: t.plan.uid
		// }

		(tasks || []).forEach((t, index) => {
			// we hash the task so we can verify it later
			// each leaf of MerkleTree is hash(claimuid, electorPubkey, vote)
			const leafValue = Poseidon.hash(
				PublicKey.fromBase58(electorId)
					.toFields()
					.concat([UID.toField(t.claimUid)])
					.concat([Field(t.result)])
			);

			tree.setLeaf(BigInt(index), leafValue);
		});

		return tree;
	}

	async function confirm() {
		isWorking = true;
		try {
			if (!isConnected) throw Error('Need to connect a wallet');
			console.log('SENDING VOTES');

			const accounts: any[] = (await (window as any).mina?.requestAccounts()) || [];
			const account = accounts[0];
			console.log('account', account);
			// let merkleTree = buildMerkleTree(votes, account);

			let signedData = await (window as any).mina?.signMessage({
				message: JSON.stringify({ root: Field(0), votes })
			});

			console.log(
				'signedData',
				signedData.publicKey,
				signedData.signature.field,
				signedData.signature.scalar
			);

			// we can now submit the Votes and continue the voting process

			let result = await $submitBatchTasks.mutateAsync({
				senderAccountId: signedData.publicKey,
				signedPack: signedData
			});

			dispatch('done', { success: true });
		} catch (err) {
			isError = true;
			errorMessage = `${err}`;
		}
		isWorking = false;
	}
</script>

<div>
	<div class="mt-20 text-center text-base">
		{#if !isConnected}
			<div class="mt-7 text-sm text-gray-900">
				You need to install or open
				<a href="https://www.aurowallet.com/" class="underline">Auro Wallet</a>
				to continue.
			</div>
		{/if}

		{#if isConnected && !isWorking}
			<div class="border-2 p-3 text-start">
				<h6 class="text-2xl font-semibold text-black">Confirmation details</h6>
				<div class="mt-4 flex items-start justify-between text-base">
					<div class="w-1/2">&nbsp;</div>
					<div class="w-1/4 text-start">
						<p class="text-gray-700">{votes.length} votes to cast</p>
					</div>
				</div>
			</div>
		{/if}

		{#if isConnected && isWorking}
			<div class="">
				<Spinner />
			</div>
			<div class="mt-7 text-sm text-gray-900">
				Check your Auro Wallet for transaction confirmation...
			</div>
		{/if}

		{#if isError}
			<div class="">SOMETHING HAPPENED !</div>
			<div class="mt-7 text-sm text-gray-900">
				{errorMessage}
			</div>
		{/if}
	</div>

	<div class="--border-t-2 absolute bottom-0 left-0 right-0 px-8 py-6 text-right text-end">
		<Button color="light" class="py-3" on:click={() => dispatch('cancel')}>I'll do it later</Button>
		&nbsp;
		<Button
			color="blue"
			class="py-3"
			disabled={!isConnected || isWorking}
			on:click={() => confirm()}
		>
			Confirm
		</Button>
	</div>
</div>
