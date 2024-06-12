<script lang="ts">
	import type { PageData } from './$types';
	import { useGetCredential } from '$lib/hooks/credentials';
	import { useGetPlan } from '$lib/hooks/plans';
	import { ErrorOnFetch, MetaTag } from '$lib/components';
	import Breadcrumbs from '$lib/components/common/Breadcrumbs.svelte';
	import PlanHeader from './PlanHeader.svelte';
	import PlanEditor from './PlanEditor.svelte';

	export let uid: string;
	const plan = useGetPlan(uid);
	$: isNew = uid === 'new';
	$: refreshOn = uid;
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
			<PlanHeader plan={$plan.data} />
			<PlanEditor plan={$plan.data} {isNew} />
		{/key}
	{/if}
</div>
