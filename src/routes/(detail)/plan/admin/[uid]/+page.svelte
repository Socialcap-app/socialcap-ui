<script lang="ts">
	import type { PageData } from './$types';
	import { useGetCredential } from '$lib/hooks/credentials';
	import { useGetPlan } from '$lib/hooks/plans';
	import { ErrorOnFetch, MetaTag } from '$lib/components';
	import Breadcrumbs from '$lib/components/common/Breadcrumbs.svelte';
	import PlanAdmin from './PlanAdmin.svelte';
	import { UID } from '$lib/types/uid';
	import { type Plan } from '$lib/types/plan';
	import { useGetAdminCommunity, useGetCommunity } from '$lib/hooks/communities';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';

	export let data: { uid: string; communityUid: string };
	const { uid, communityUid } = data;
	$: refreshOn = uid;
	$: isNew = uid === 'new';
	$: plan = useGetPlan(uid);
	$: community = useGetAdminCommunity(communityUid ||  $plan.data?.communityUid!);
	const newPlan: Plan = {
		// uid: UID.uuid4(),
		communityUid: communityUid,
		name: '',
		state: 1, // DRAFT
		stateDescr: 'DRAFT',
		createdUTC: new Date(),
		updatedUTC: new Date(),
		evidence: [],
		fee: 5, // the fee in MINA required for this credential
		rewardsShare: 60, // percentaje of the fee that will go to validator rewards
		communityShare: 30, // percentaje of fee that will go to the community
		protocolShare: 10 // percentaje of fee that will go to the Protocol (Socialcap)
	};
</script>

<MetaTag path="plan" title="Socialcap" subtitle={`Plan`} description="" />

<div class="px-2">
	{#if $plan.isLoading || $community.isLoading || !$community.data}
		<LoadingSpinner />
	{:else if $plan.isError || $community.isError}
		<ErrorOnFetch description="A new claim" error={$plan.error || $community.error} />
	{:else}
		<Breadcrumbs label={$plan.data?.name || '?'} />
		{#if isNew}
			<PlanAdmin plan={newPlan} {isNew} communityPlans={$community.data?.plans}/>
		{:else}
			{#key refreshOn}
				<PlanAdmin plan={$plan.data} {isNew} communityPlans={$community.data?.plans} />
			{/key}
		{/if}
	{/if}
</div>
