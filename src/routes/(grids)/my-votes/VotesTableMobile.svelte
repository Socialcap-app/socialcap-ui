<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Button,
		Avatar,
		RadioButton,
		ButtonGroup
	} from 'flowbite-svelte';
	import { Icon, StateBadge } from '$lib/components';
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

{#if data && Array.isArray(data)}
	<Table class="p-0">
		<TableBody class="table-fixed">
			{#each data || [] as t, i}
				<TableBodyRow>
					<TableBodyCell class="px-0 py-4">
						<div class="mx-auto flex w-full items-center space-x-4">
							<div>
								<StateBadge class="text-xs" data={t.state} />
							</div>
							<div class="flex flex-col space-y-4">
								<div class="space-y-1">
									<div>{t.community}</div>
									<div>{t.claimer}</div>
									<!-- <div>Todo</div> -->
								</div>
								<div>
									{#if t.state === ASSIGNED}
										<ButtonGroup size="xs">
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
								</div>
							</div>
						</div></TableBodyCell
					>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
{/if}
{#if assignedVotes > 0}
	<ActionFooter tasks={data} />
{/if}
