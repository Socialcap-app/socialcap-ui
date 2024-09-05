<script lang="ts">
	import type { OnchainCredentialData } from '$lib/types';
	import { Badge } from 'flowbite-svelte';
	import Time from 'svelte-time/Time.svelte';

	export let data: OnchainCredentialData;

    function sliced(s: string): string {
    return (s.slice(0,4)+'...'+s.slice(-5))
  }
</script>

<div class="p-4">
	<div class="border-1 block w-full rounded px-4">
		<div class="mb-5 leading-relaxed">
			<p>
				<span class="text-bold text-sm">Network: </span>
				<span class="mt-2 text-sm text-gray-500">MINA {data.chain}</span>
			</p>
			<p>
				<span class="text-bold text-sm">Account: </span>
                <span class="mt-1 inline-block text-sm">
                    {sliced(data.address)}
                </span>
			</p>
			<p>
				<span class="text-bold text-sm">Claim ID: </span>
                <span class="mt-1 inline-block text-sm">
                    {sliced(data.claimUid)}
                </span>
			</p>
			<p>
				<span class="text-bold text-sm">Created by: </span>
				<span class="mt-1 inline-block text-sm">
                    {sliced(data.applicantUid)}
                </span>
			</p>
			<p>
				<span class="text-bold text-sm">Quorum: </span>
				<span class="mt-2 text-sm text-gray-500">{data.requiredQuorum} votes</span>
			</p>
			<p>
				<span class="text-bold text-sm">Required: </span>
				<span class="mt-2 text-sm text-gray-500">{data.requiredPositives} positives votes</span>
			</p>
			<div class="mt-4 flex items-start justify-between text-xs">
                <div class="w-1/3">
                    <b>Votes</b><br />
                    <span class="mt-1 inline-block text-sm">
                        <Badge color="green" rounded no-border class="me-4 font-bold text-black">
                            + {data.positives}
                        </Badge>
                        <Badge color="red" rounded no-border class="me-4 font-bold text-black">
                            - {data.negatives}
                        </Badge>
                        <Badge color="gray" rounded no-border class="me-4 font-bold text-black">
                            ? {data.ignored}
                        </Badge>
                    </span>
                </div>
            </div>
            <div class="mt-2 border-t pt-4">
                <p class="text-xs"><b>History</b></p>
                {#each data.transactions || [] as t}
                    <div class="flex items-end justify-between">
                        <p class="w-1/3 text-sm">{t.type}</p>
                        <p class="w-1/3 text-sm">
                            <a href={t.url} class="mt-1 inline-block text-sm text-blue-600">
                                {sliced(t.hash)}
                            </a>
                        </p>
                        <p class="w-1/3 text-sm">
                            <Time format="MMM DD, YYYY" timestamp={t.createdUTC} />
                        </p>
                    </div>
                {/each}
            </div>
		</div>
	</div>
</div>





