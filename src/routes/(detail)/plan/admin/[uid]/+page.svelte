<script lang="ts">
	import type { PageData } from './$types';
	import { useGetCredential } from '$lib/hooks/credentials';
	import { useGetPlan } from '$lib/hooks/plans';
	import { ErrorOnFetch, MetaTag } from '$lib/components';
	import Breadcrumbs from '$lib/components/common/Breadcrumbs.svelte';
	import PlanAdmin from './PlanAdmin.svelte';
	import { UID } from '$lib/types/uid';
	import {type Plan} from "$lib/types/plan"

	export let data: { uid: string; communityUid: string };
	const { uid, communityUid } = data;
	$: refreshOn = uid;
	$: isNew = uid === 'new';
	$: plan = useGetPlan(uid);
	const newPlan: Plan = {
		uid: UID.uuid4(),
		communityUid: communityUid,
		name: '',
		state: 1, // DRAFT
		stateDescr: "DRAFT",
		createdUTC: new Date(),
		updatedUTC: new Date(),
		evidence: [],
	};
</script>

<MetaTag path="plan" title="Socialcap" subtitle={`Plan`} description="" />

<div class="px-2">
	{#if $plan.isLoading}
		<span>Loading...</span>
	{:else if $plan.isError}
		<ErrorOnFetch description="A new claim" error={$plan.error} />
	{:else}
		<Breadcrumbs label={$plan.data?.name || '?'} />

		{#if isNew}
			<PlanAdmin plan={newPlan} />
		{:else}
			{#key refreshOn}
				<PlanAdmin plan={$plan.data} />
			{/key}
		{/if}
	{/if}
</div>
