<script lang="ts">
	import { type Plan } from '$lib/types/plan';
	import { Card, Badge, Avatar, Button, Img, Tabs, TabItem } from 'flowbite-svelte';
	import Time from 'svelte-time';
	import { H1, SubmitButton } from '$lib/components';
	import { onMount } from 'svelte';
	import StateBadge from '$lib/components/common/StateBadge.svelte';
	import AdminCredentialBanner from '$lib/components/credentials/AdminCredentialBanner.svelte';
	import TabHeader from '$lib/components/common/TabHeader.svelte';
	import Voting from './Voting.svelte';
	import Claims from './Claims.svelte';
	import Strategy from './Strategy.svelte';
	import EvidenceEditor from './EvidenceEditor.svelte';
	import FeesShares from './FeesShares.svelte';
	import General from './General.svelte';
	import { useUpdatePlan } from '$lib/hooks/plans';

	export let plan: Plan | undefined = undefined;
	const updatePlan = useUpdatePlan(plan?.uid);
	// use it for updating button text when submitting
	$: working = $updatePlan.isPending ? 'Saving' : undefined;
	let activeTab = 0;
	async function submit() {}
</script>

<div class="w-full max-w-screen-lg">
	<AdminCredentialBanner image={plan?.image} />

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
				disabled={$updatePlan.isPending}
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
		{#if plan}
			<Tabs
				style="underline"
				contentClass="pt-14 pr-5 pb-4 pl-7 bg-transparent rounded-lg dark:bg-gray-800"
				defaultClass="flex flex-wrap items-end justify-center space-x-8 rtl:space-x-reverse"
			>
				<TabItem open={activeTab === 0}>
					<TabHeader showCount={false} slot="title" label="General" />
					<div>
						<General {plan} />
					</div>
				</TabItem>

				<TabItem open={activeTab === 1}>
					<TabHeader showCount={false} slot="title" label="Fees & Shares" />
					<div>
						<FeesShares {plan} />
					</div>
				</TabItem>

				<TabItem open={activeTab === 2}>
					<TabHeader showCount={false} slot="title" label="Evidence" />
					<div class="">
						<EvidenceEditor {plan} />
					</div>
				</TabItem>

				<TabItem open={activeTab === 3}>
					<TabHeader showCount={false} slot="title" label="Strategy" />
					<div class="">
						<Strategy {plan} />
					</div>
				</TabItem>
				<TabItem open={activeTab === 4}>
					<TabHeader showCount={false} slot="title" label="Claims" />
					<div class="">
						<Claims {plan} />
					</div>
				</TabItem>

				<TabItem open={activeTab === 5}>
					<TabHeader showCount={false} slot="title" label="Voting" />
					<div class="">
						<Voting {plan} />
					</div>
				</TabItem>
			</Tabs>
		{/if}
	</div>
</div>
