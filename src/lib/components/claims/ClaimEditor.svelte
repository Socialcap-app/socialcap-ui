<script lang="ts">
	import type { Plan } from '$lib/types';
	import type { Claim } from '$lib/types/claim';
	import { Alert, Button } from 'flowbite-svelte';
	import StateBadge from '../common/StateBadge.svelte';
	import EvidenceForm from './EvidenceForm.svelte';
	import { PaymentStep } from './payment-flow';
	import PaymentDialog from './PaymentDialog.svelte';
	import EvidenceFormPreview from './EvidenceFormPreview.svelte';
	import { useSaveDratClaim, useUpdateClaim } from '$lib/hooks/claims';
	import { goto } from '$app/navigation';
	import { DRAFT, UNPAID } from '$lib/types/states';
	import { useGetCommunity } from '$lib/hooks/communities';
	import { useGetMyCredentials } from '$lib/hooks/credentials';
	import LoadingSpinner from '../common/LoadingSpinner.svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';
	import { fade } from 'svelte/transition';

	export let plan: any, claim: any, isNew: boolean, mode: 'view' | 'edit';
	const communityQuery = useGetCommunity(plan.communityUid, true);
	const myCredentialsQuery = useGetMyCredentials();
	const saveClaim = useSaveDratClaim();
	const updateClaim = useUpdateClaim();

	$: communityPlans = $communityQuery.data?.plans;
	$: myCredentials = $myCredentialsQuery.data;

	let toggleDialog: boolean = false,
		step = 0;
	let previewOn = mode === 'view';
	let formComponent: any;
	let formHasErrors: boolean = true;
	let showFormHasErrorDialog: boolean = false;

	async function confirmSubmission() {
		toggleDialog = !formHasErrors;
	}

	async function checkFormErrors() {
		formHasErrors = formComponent.hasErrors();
		showFormHasErrorDialog = formHasErrors;
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

	$: {
		console.log(claim);
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
{#if $communityQuery.isLoading}
	<LoadingSpinner />
{:else}
	<div class="relative">
		{#if showFormHasErrorDialog}
			<div in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
				<Alert
					border
					color="yellow"
					class="fixed left-1/2 top-24 w-4/5 -translate-x-1/2 transform sm:w-3/5"
				>
					<InfoCircleSolid slot="icon" class="h-5 w-5" />
					<span class="font-medium">Form Submission Error!</span>
					Please review the required fields and correct any errors before submitting again.
				</Alert>
			</div>
		{/if}
		<div class="mb-24 w-full p-8">
			<!-- <pre class="text-xs">
      {JSON.stringify(plan?.evidence, null, 2)}
    </pre> -->
			{#if !previewOn}
				<form>
					<EvidenceForm
						bind:this={formComponent}
						on:validationChange={() => checkFormErrors()}
						eform={plan?.evidence}
						data={claim?.evidenceData}
						communityUid={plan?.communityUid}
						{communityPlans}
						{myCredentials}
					/>
				</form>
			{:else}
				<EvidenceFormPreview evidenceData={claim?.evidenceData} />
			{/if}
		</div>

		<div class="fixed bottom-0 left-0 right-0 border-t-2 bg-white py-4 lg:left-64">
			<div
				class="border-3 --bg-red-300 flex flex-wrap items-center justify-center gap-4 px-8 max-[465px]:justify-between sm:justify-end"
			>
				<div class="sm:absolute sm:left-20">
					{#if !previewOn}
						<Button
							disabled={!isEditable()}
							alternate
							color="light"
							on:click={() => (previewOn = true)}>Preview</Button
						>
					{:else}
						<Button
							disabled={!isEditable()}
							alternate
							color="light"
							on:click={() => (previewOn = false)}>Edit</Button
						>
					{/if}
				</div>

				<span class="me-8 justify-end text-sm sm:mx-3">
					Status <StateBadge data={claim?.state} />
				</span>

				<Button
					disabled={!isEditable()}
					size="lg"
					color="light"
					class="me-2"
					on:click={() => saveDraft()}
				>
					{#if $saveClaim.isPending || $updateClaim.isPending}
						Saving...
					{:else}
						Save Draft
					{/if}</Button
				>
				<Button
					no-disabled={!isEditable() || formHasErrors}
					size="lg"
					primay
					class="me-8"
					on:click={() => confirmSubmission()}>Submit</Button
				>
			</div>
      <div>
        hasErrors: {formHasErrors} editable: {isEditable()}
      </div>
		</div>
	</div>
{/if}
