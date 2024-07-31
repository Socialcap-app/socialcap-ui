<script lang="ts">
	// import { useGetCredentialOnchainData } from '$lib/hooks/credentials';
  import { getCredentialOnchainData } from '$lib/api/credentials-api';
	import { onMount } from 'svelte';
	import { Label, Input, Button, Modal, Checkbox, Helper, Badge } from 'flowbite-svelte';
  import ErrorOnFetch from '../common/ErrorOnFetch.svelte';
  import NoData from '../common/NoData.svelte';
  import Time from 'svelte-time/Time.svelte';
	import LoadingSpinner from '../common/LoadingSpinner.svelte';

	export let 
    open = false,
    onchainData: any = null;
  
	//let onchainData; // useGetCredentialOnchainData(claimUid);

	// onMount(() => {});
  function sliced(s: string): string {
    return (s.slice(0,4)+'...'+s.slice(-5))
  }
</script>

<Modal bind:open size="lg" autoclose class="w-full max-w-screen-md">
    <div class="p-4">
      <!-- <p class="text-lg font-semibold text-black">
        Let's join <b>{title}</b>
      </p> -->
      {#if !onchainData}
        <LoadingSpinner />
      {:else}
        <div>
          <p class="text-sm">Network: <b>MINA {onchainData.chain}</b></p>
        </div>
        <div class="mt-4 text-xs flex items-start justify-between">
          <div class="w-1/3">
            <b>Account</b><br/>
            <a href={onchainData.url} class="text-sm text-blue-600 inline-block mt-1">
              {sliced(onchainData.address)}
            </a>
          </div>
          <div class="w-1/3">
            <b>Claim ID</b><br/>
            <span class="text-sm inline-block mt-1">
              {sliced(onchainData.claimUid)}
            </span>
          </div>  
          <div class="w-1/3">
            <b>Owner</b><br/>
            <span class="text-sm inline-block mt-1">
              {sliced(onchainData.applicantUid)}
            </span>
          </div>
          <!--  
          -->
          <br>
        </div>
        <div class="mt-4 text-xs flex items-start justify-between">
          <div class="w-1/3">
            <b>Required Quorum</b><br/>
            <span class="text-sm inline-block mt-1 font-bold">
              {onchainData.requiredQuorum}
            </span>
          </div>
          <div class="w-1/3">
            <b>Required Positives</b><br/>
            <span class="text-sm inline-block mt-1 font-bold">
              {onchainData.requiredPositives}
            </span>
          </div>  
          <div class="w-1/3">
            <b>Votes</b><br/>
            <span class="text-sm inline-block mt-1">
              <Badge color="green" rounded no-border class="me-4 font-bold text-black">
                + {onchainData.positives}
              </Badge>
              <Badge color="red" rounded no-border class="me-4 font-bold text-black">
                - {onchainData.negatives}
              </Badge>
              <Badge color="gray" rounded no-border class="me-4 font-bold text-black">
                  ? {onchainData.ignored}
              </Badge>
            </span>
          </div>
        </div>
        <div class="mt-2 border-t pt-4">
          <p class="text-xs"><b>History</b></p>
          {#each (onchainData.transactions || []) as t}
            <div class="flex items-end justify-between">
              <p class="text-sm w-1/3">{t.type}</p>
              <p class="text-sm w-1/3">
                <a href={t.url} class="text-sm text-blue-600 inline-block mt-1">
                  {sliced(t.hash)}
                </a>
              </p>
              <p class="text-sm w-1/3">
                <Time format="MMM DD, YYYY" timestamp={t.createdUTC} />
              </p>
            </div>
          {/each}

        </div>
        <hr class="mt-4">
        <!-- <pre>
          {JSON.stringify(onchainData, null, 2)} 
        </pre> -->
      {/if}
    </div>

    <!-- <div class="flex items-center justify-end mt-4">
      <Button on:click={() => open = false}
				color="light" size="md" class="text-sm">
				Close
			</Button>
      &nbsp;
    </div>   -->
</Modal>
