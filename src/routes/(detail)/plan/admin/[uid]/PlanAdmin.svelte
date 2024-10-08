<script lang="ts">
	import { type Plan } from '$lib/types/plan';
	import { Card, Badge, Avatar, Button, Img, Tabs, TabItem } from 'flowbite-svelte';
	import Time from 'svelte-time';
	import { H1, SubmitButton } from '$lib/components';
	import StateBadge from '$lib/components/common/StateBadge.svelte';
	import TabHeader from '$lib/components/common/TabHeader.svelte';
	import Voting from './Voting.svelte';
	import Claims from './Claims.svelte';
	import Strategy from './Strategy.svelte';
	import EvidenceEditor from './EvidenceEditor.svelte';
	import FeesShares from './FeesShares.svelte';
	import General from './General.svelte';
	import { useCreatePlan, useUpdatePlan } from '$lib/hooks/plans';
	import { goto } from '$app/navigation';
	import { type Claim } from '$lib/types/claim';
	import Banner from '$lib/components/common/Banner.svelte';

	export let plan: Plan | undefined = undefined, isNew: boolean | undefined, communityPlans: Plan[], communityClaims: Claim[];
	const updatePlan = useUpdatePlan(plan?.uid);
	const createPlan = useCreatePlan();
	// use it for updating button text when submitting
	$: working = $updatePlan.isPending || $createPlan.isPending ? 'Saving' : undefined;
	let activeTab = 0;
	function updateImage(img: string) {
		if (plan)
			plan.image = img;
	}
	async function submit() {
		if (isNew)	
			await $createPlan.mutateAsync(plan!);
		else
			await $updatePlan.mutateAsync(plan!);
		goto('/community/admin/' + plan?.communityUid);
	}
</script>

<div class="w-full max-w-screen-lg">
	{#if plan}
	<Banner isAdmin={true} image={plan?.image} on:updateimage={(e) => updateImage(e.detail.image)}/>

	<div class="">
		<div class="flex items-center justify-between">
			<div>
				<StateBadge data={plan?.state} />
				<span class="ms-2 text-xs">
					Last update <Time
						relative={true}
						timestamp={plan?.createdUTC.toString().replace('T', ' ')}
					/>
				</span>
			</div>
			<SubmitButton
				on:click={(e) => {
					e.preventDefault();
					e.stopPropagation();
					submit();
				}}
				{working}
				disabled={$updatePlan.isPending || $createPlan.isPending}
				size="md"
				class="bg-sc_red px-3 hover:bg-sc_red lg:w-32"
			>
				Save Changes
			</SubmitButton>
		</div>

		<h6 class="mb-2 mt-2 text-3xl font-bold text-gray-900 dark:text-white">
			{plan?.name}
		</h6>
		<p class="mb-2 text-base text-gray-600 dark:text-gray-400">
			{plan?.description}
		</p>
		
			<Tabs
				style="underline"
				contentClass="pt-14 pr-5 pb-4 pl-7 bg-transparent rounded-lg dark:bg-gray-800"
				defaultClass="flex flex-wrap items-end justify-center space-x-8 rtl:space-x-reverse"
			>
				<TabItem open={activeTab === 0} on:click={(e) => (activeTab = 0)}>
					<TabHeader showCount={false} slot="title" label="General" />
					<General bind:plan />
				</TabItem>

				<TabItem open={activeTab === 1} on:click={(e) => (activeTab = 1)}>
					<TabHeader showCount={false} slot="title" label="Fees & Shares" />

					<FeesShares bind:plan />
				</TabItem>

				<TabItem open={activeTab === 2} on:click={(e) => (activeTab = 2)}>
					<TabHeader showCount={false} slot="title" label="Evidence" />
					<div class="mb-6">
						<div class="mb-6 space-y-2 border-b border-gray-200 pb-6">
							<p class="text-base font-medium">Evidence fiels</p>
							<p class="text-sm text-[#7E8390]">
								This is the set of evidence that the applicant will be required to fill to sustain
								his/her claim.
							</p>
						</div>
						<EvidenceEditor {communityPlans} bind:plan={plan}  />
					</div>
				</TabItem>

				<TabItem open={activeTab === 3} on:click={(e) => (activeTab = 3)}>
					<TabHeader showCount={false} slot="title" label="Strategy" />

					<Strategy bind:plan />
				</TabItem>
				<TabItem open={activeTab === 4} on:click={(e) => (activeTab = 4)}>
					<TabHeader showCount={false} slot="title" label="Claims" />

					<Claims bind:plan claims={communityClaims} />
				</TabItem>

				<TabItem open={activeTab === 5} on:click={(e) => (activeTab = 5)}>
					<TabHeader showCount={false} slot="title" label="Voting" />
					<Voting bind:plan />
				</TabItem>
			</Tabs>
		
	</div>
	{/if}
</div>
