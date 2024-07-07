<script lang="ts">
	import { onMount } from 'svelte';
	import { MetaTag } from '$lib/components';
	// import ClaimEditor from "./ClaimEditor.svelte";
	import ErrorOnFetch from '$lib/components/common/ErrorOnFetch.svelte';
	import ClaimHeader from '$lib/components/claims/ClaimHeader.svelte';
	import ClaimEditor from '$lib/components/claims/ClaimEditor.svelte';
	import Breadcrumbs from '$lib/components/common/Breadcrumbs.svelte';
	import type { User } from '$lib/types';
	import { getCurrentUser } from '$lib/store';
	import { useGetPlan } from '$lib/hooks/plans';
	import { useGetClaim } from '$lib/hooks/claims';

	export let data: any;

	let profile: User | null = getCurrentUser();
	$: isNew = data.uid === 'new';
	$: mode = data.mode || 'view';
	$: refreshOn = data.uid;

	const planQuery = useGetPlan(data.planUid);
	$: plan = $planQuery.data;
	let claim: any = null;
	$: claim = useGetClaim(data.uid, plan);
</script>

<MetaTag path="claim" title="Socialcap" subtitle={`Claim`} description="" />

<div class="px-2">
	{#if $planQuery.isLoading }
		<span>Loading...</span>
	{:else if $planQuery.isError}
		<ErrorOnFetch description="A new claim" error={$planQuery.error} />
	{:else}
		<Breadcrumbs label={plan?.name || '?'} />

		{#key refreshOn}
			{#if $claim.isLoading}
				<span>Loading...</span>
			{:else if $claim.isError}
				<ErrorOnFetch description="A new claim" error={$claim.error} />
			{:else}
				<ClaimHeader {plan} claim={$claim.data} {isNew} />
				<ClaimEditor 
          claim={$claim.data} 
          {plan} 
          {isNew} 
          mode={isNew ? "edit" : mode} />
			{/if}
		{/key}
	{/if}
</div>
