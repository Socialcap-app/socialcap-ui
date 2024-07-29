<script lang="ts">
	import StateBadge from '$lib/components/common/StateBadge.svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		A,
		Label,
		P,
		TableSearch
	} from 'flowbite-svelte';
	import { AngleDownOutline, AngleUpOutline } from 'flowbite-svelte-icons';

	export let data;

	let openRow: number | null = null;
	let details;
	let doubleClickModal = false;

	const toggleRow = (i: number) => {
		openRow = openRow === i ? null : i;
	};
</script>

{#if data && Array.isArray(data)}
	<Table hoverable={true}>
		<TableHead class="text-md bg-white normal-case text-gray-500">
			<TableHeadCell>Applicant</TableHeadCell>
			<TableHeadCell>Details</TableHeadCell>
			<TableHeadCell>Status</TableHeadCell>
			<TableHeadCell></TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y table-auto">
			{#each data || [] as t, i}
				<TableBodyRow on:click={() => toggleRow(i)}>
					<TableBodyCell>
						{t.applicant}
					</TableBodyCell>
					<TableBodyCell>
						{t.details || ''}
					</TableBodyCell>
					<TableBodyCell><StateBadge data={t.state} /></TableBodyCell>
					<TableBodyCell
						>{#if openRow == i}
							<AngleUpOutline />
						{:else}
							<AngleDownOutline />{/if}</TableBodyCell
					>
				</TableBodyRow>
				{#if openRow === i}
					<TableBodyRow
						class="px-2"
						on:dblclick={() => {
							doubleClickModal = true;
							details = t;
						}}
					>
						<TableBodyCell colspan="4" class="p-1">
							{#each t.evidenceData as evidence, j}
								<div class="flex flex-col p-1">
									<Label>{evidence.label}</Label>
									{#if evidence.type === 'links'}
										{#each evidence.value as link, k}
											<A class="font-medium hover:underline" href={link}>
												Link #{k}
											</A>
										{/each}
									{:else}
										<P space="tight" weight="thin">{evidence.value}</P>
									{/if}
								</div>
							{/each}
						</TableBodyCell>
					</TableBodyRow>
				{/if}
			{/each}
		</TableBody>
	</Table>
{/if}
