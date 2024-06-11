<script lang="ts">
	import StateBadge from '$lib/components/common/StateBadge.svelte';
	import {
	Button,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
  import {CirclePlusSolid} from "flowbite-svelte-icons"
	import Time from 'svelte-time/Time.svelte';
	import type { Plan } from '$lib/types';
	import { goto } from '$app/navigation';

	export let data: Plan[] = [], communityUid: string = '';
	console.log('plan data', data);
</script>

<div class="flex flex-col items-end space-y-2">
	<Table>
		<TableHead class="text-md bg-white normal-case text-gray-500">
			<TableHeadCell>Campaign</TableHeadCell>
			<TableHeadCell>Created</TableHeadCell>
			<TableHeadCell>Starts</TableHeadCell>
			<TableHeadCell>Ends</TableHeadCell>
			<TableHeadCell>Status</TableHeadCell>
		</TableHead>
		<TableBody class="divide-y">
			{#each data || [] as t}
				<TableBodyRow class="cursor-pointer" on:click={() => goto(`/plan/${t.uid}/`)}>
					<TableBodyCell>
						<div class="flex items-center space-x-3">
							<img class="h-12 w-12 rounded-full" src={t.image} alt="Badge" />
							<div class="grid grid-cols-1 gap-0">
								<p class="text-x truncate text-gray-400">{t.name}</p>
							</div>
						</div>
					</TableBodyCell>
					<TableBodyCell><Time timestamp={t.createdUTC} /></TableBodyCell>
					<TableBodyCell
						>{#if t.startsUTC}
							(<Time timestamp={t.startsUTC} />)
						{:else}
							<p>-</p>
						{/if}</TableBodyCell
					>
					<TableBodyCell
						>{#if t.endsUTC}
							(<Time timestamp={t.endsUTC} />)
						{:else}
							<p>-</p>
						{/if}</TableBodyCell
					>
					<TableBodyCell><StateBadge data={t.state} /></TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
	<Button color="blue" class="py-3" on:click={() => goto("/plan/admin/"+communityUid+"/plan/new")}><CirclePlusSolid class="me-2 h-5 w-5"/> Create a campaign</Button>
</div>
