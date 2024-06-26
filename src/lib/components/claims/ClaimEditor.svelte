<script lang="ts">
	import type { Plan } from '$lib/types';
	import type { Claim } from '$lib/types/claim';
	import { Button } from 'flowbite-svelte';
	import StateBadge from '../common/StateBadge.svelte';
	import EvidenceForm from './EvidenceForm.svelte';
	import { PaymentStep } from './payment-flow';
	import PaymentDialog from './PaymentDialog.svelte';
	import EvidenceFormPreview from './EvidenceFormPreview.svelte';
	import { useSaveDratClaim, useUpdateClaim } from '$lib/hooks/claims';
	import { goto } from '$app/navigation';
	import { DRAFT, UNPAID } from '$lib/types/states';

	export let plan: any, claim: any, isNew: boolean, mode: 'view' | 'edit';
	const saveClaim = useSaveDratClaim();
	const updateClaim = useUpdateClaim();

	let toggleDialog = false,
		step = 0;
	let previewOn = mode === 'view';
	async function confirmSubmission() {
		toggleDialog = true;
	}

	async function saveDraft() {
		if (isNew) {
			const result = await $saveClaim.mutateAsync(claim);
		} else {
			const result = await $updateClaim.mutateAsync(claim);
		}
		goto('/my-claims');
	}
	function isEditable() {
		return claim?.state === DRAFT || claim?.state === UNPAID;
	}
</script>

{#if toggleDialog}
	<PaymentDialog 
    bind:open={toggleDialog} 
    step={PaymentStep.CONFIRM_SUBMIT} 
    {claim} 
    {plan} 
    {isNew} 
  />
{/if}

<div class="relative">
	<div class="mb-24 w-full p-8">
		<!-- <pre class="text-xs">
      {JSON.stringify(plan?.evidence, null, 2)}
    </pre> -->
		{#if !previewOn}
			<form>
				<EvidenceForm eform={plan?.evidence} data={claim?.evidenceData} />
			</form>
		{:else}
			<EvidenceFormPreview evidenceData={claim?.evidenceData} />
		{/if}
	</div>

	<div class="fixed bottom-0 left-0 right-0 border-t-2 bg-white py-4 lg:left-64">
		<div class="border-3 --bg-red-300 flex items-center justify-between px-8">
			<div class="ps-8">
				{#if !previewOn}
					<Button disabled={!isEditable()} alternate color="light" on:click={() => (previewOn = true)}>Preview</Button>
				{:else}
					<Button disabled={!isEditable()} alternate color="light" on:click={() => (previewOn = false)}>Edit</Button>
				{/if}
			</div>

			<div>
				<span class="me-8 justify-end text-sm">
					Status <StateBadge data={claim?.state} />
				</span>

				<Button disabled={!isEditable()}  size="lg" color="light" class="me-2" on:click={() => saveDraft()}>
					{#if $saveClaim.isPending || $updateClaim.isPending}
						Saving...
					{:else}
						Save Draft
					{/if}</Button
				>
				<Button disabled={!isEditable()} size="lg" primay class="me-8" on:click={() => confirmSubmission()}>Submit</Button>
			</div>
		</div>
	</div>
</div>
