<script lang="ts">
	import StateBadge from '$lib/components/common/StateBadge.svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Button,
		Avatar,
		ButtonGroup,
		RadioButton,
		Dropdown
	} from 'flowbite-svelte';
	import { type Task } from '$lib/types/task';
	import { ASSIGNED } from '$lib/types/states';
	import ActionFooter from './ActionFooter.svelte';
	export let data: Task[] = [];
	$: assignedVotes = data && data.filter((v) => v.state === ASSIGNED).length;

	const changeVote = (e: any, t: Task, index: number) => {
		console.log('data', data);
		if (t.result == e.target.value) {
			// remove vote
			data[index] = { ...t, result: '7' };
		}
		console.log('index', index);
	};
</script>

<div class="relative">
	{#if data && Array.isArray(data)}
		<Table>
			<TableHead class="text-md bg-white normal-case text-gray-500">
				<TableHeadCell>Status</TableHeadCell>
				<TableHeadCell>Credential Name</TableHeadCell>
				<TableHeadCell>Applicant</TableHeadCell>
				<!-- <TableHeadCell>Details</TableHeadCell> -->
				<TableHeadCell>Vote</TableHeadCell>
			</TableHead>
			<TableBody class="divide-y">
				{#each data || [] as t, i}
					<TableBodyRow>
						<TableBodyCell>
							<StateBadge data={t.state} />
						</TableBodyCell>
						<TableBodyCell>
							<a href={`/claim/${t.claimUid}?mp=${t.planUid}&mode=view`}>
								<div class="text-xs text-gray-400">
									{t.community}
								</div>
								<div class="text-dark mt-1 text-wrap text-sm">
									{t.plan}
								</div>
								<div class="mt-1 text-xs text-blue-600">
									{t.claimUid.slice(0, 4)}...{t.claimUid.slice(-6)}
								</div>
							</a>
						</TableBodyCell>
						<TableBodyCell>
							{t.claimer}
						</TableBodyCell>
						<!-- <TableBodyCell>Todo</TableBodyCell> -->
						<TableBodyCell>
							{#if t.state === ASSIGNED}
								<ButtonGroup>
									<RadioButton
										on:click={(e) => changeVote(e, t, i)}
										class={t.result === '1' ? 'bg-green-100 text-green-800' : ''}
										value={'1'}
										bind:group={t.result}>Yes</RadioButton
									>
									<RadioButton
										on:click={(e) => changeVote(e, t, i)}
										class={t.result === '-1' ? 'bg-red-100 text-red-800' : ''}
										value={'-1'}
										bind:group={t.result}>No</RadioButton
									>
									<RadioButton
										on:click={(e) => changeVote(e, t, i)}
										class={t.result === '0' ? 'bg-yellow-100 text-yellow-800' : ''}
										value={'0'}
										bind:group={t.result}>Abstain</RadioButton
									>
								</ButtonGroup>
							{/if}
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>

		<div>
			<br /><br /><br /><br />
		</div>
	{/if}
	{#if assignedVotes > 0}
		<ActionFooter tasks={data} />
	{/if}
</div>
