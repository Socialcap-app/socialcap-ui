<script>
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Button,
		Avatar
	} from 'flowbite-svelte';
	import Time from 'svelte-time';
	import { Icon, StateBadge } from '$lib/components';
	import { goto } from '$app/navigation';

	export let data;
</script>

{#if data && Array.isArray(data)}
	<Table class="p-0">
		<TableBody class="table-fixed">
			{#each data || [] as t}
				<TableBodyRow on:click={() => goto(`/claim/${t.uid}/?mp=${t.planUid}&mode=view`)}>
					<TableBodyCell>
						<div class="flex justify-between">
							<div class="flex space-x-4">
								<Avatar src={t.image} class="round h-10 w-10 drop-shadow-lg" />
								<div class="space-y-4">
									<div class="flex items-center justify-between">
										<div class="grid grid-cols-1 gap-1">
											<p class="text-weight-400 truncate text-xs text-gray-500">{t.community}</p>
											<p class="text-weight-600 text-md truncate">{t.type}</p>
										</div>
									</div>
									<div class="flex space-x-4 md:space-x-6">
										<div class="grid grid-cols-1 gap-1">
											<p class="text-weight-500 text-xs text-gray-500">Created</p>
											<p class="text-xs"><Time format="DD MMM, YYYY" timestamp={t.createdUTC} /></p>
										</div>
										<div class="grid grid-cols-1 gap-1 text-center">
											<p class="text-weight-500 text-xs text-gray-500">Issues</p>
											<p class="text-xs">
												{#if t.issuedUTC}<Time timestamp={t.issuedUTC} />
												{:else}-{/if}
											</p>
										</div>
									</div>
								</div>
							</div>
							<div>
								<StateBadge class="text-xs" data={t.state} />
							</div>
						</div>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
{/if}
