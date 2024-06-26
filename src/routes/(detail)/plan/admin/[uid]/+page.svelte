<script lang="ts">
	import type { PageData } from './$types';
	import { useGetCredential } from '$lib/hooks/credentials';
	import { useGetPlan } from '$lib/hooks/plans';
	import { ErrorOnFetch, MetaTag } from '$lib/components';
	import Breadcrumbs from '$lib/components/common/Breadcrumbs.svelte';
	import PlanAdmin from './PlanAdmin.svelte';

	export let data: any;
  	$: refreshOn = data.uid;
	console.log("getting plan", data.uid);
	$: plan = useGetPlan(data.uid);
	$: isNew = data.uid === 'new';
</script>

<MetaTag path="claim" title="Socialcap" subtitle={`Claim`} description="" />

<div class="px-2">
	{#if $plan.isLoading}
		<span>Loading...</span>
	{:else if $plan.isError}
		<ErrorOnFetch description="A new claim" error={$plan.error} />
	{:else}
		<Breadcrumbs label={$plan.data?.name || '?'} />

		{#key refreshOn}
			<PlanAdmin plan={$plan.data} />
		{/key}
	{/if}
</div>
