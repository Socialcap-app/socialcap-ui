<script lang="ts">
  import { createEventDispatcher, onMount, tick } from 'svelte';
  import { Button, Badge, Spinner } from 'flowbite-svelte';
  import Time from 'svelte-time/Time.svelte';
  import { type Claim } from '$lib/types/claim';
  import { PayedBy, type Plan } from '$lib/types';
  import { createDepositFeeTransaction, TXNFEE } from '$lib/transactions/payments';
  import { getCurrentBlockchain } from '$lib/store';
  import { useSaveDratClaim, useUpdateClaim } from '$lib/hooks/claims';
  import { CLAIMED, UNPAID } from '$lib/types/states';

  const dispatch = createEventDispatcher();

  export let plan: Plan, claim: Claim, isNew: boolean;
  $: payedByCommunity = (plan.payedBy === PayedBy.community);    
  const saveClaimMutation = useSaveDratClaim();
  const updateClaimMutation = useUpdateClaim();
  let isWorking = false,
    isError = false,
    isConnected = false;
  let payer = '';
  let errorMessage = '';

  onMount(async () => {
    isConnected = await isWalletConnected();
  });

  function isWalletAvailable() {
    return typeof (window as any).mina !== 'undefined';
  }

  async function isWalletConnected() {
    if (isWalletAvailable()) {
      const accounts: any[] = (await (window as any).mina?.getAccounts()) || [];
      if (accounts.length) {
        payer = accounts[0];
        return true;
      }
    }
    return false;
  }
  async function saveNewClaim() {
    const state = plan.payedBy === PayedBy.community ? CLAIMED : UNPAID;
    await $saveClaimMutation.mutateAsync({ ...claim, state: state });
  }
  async function updateClaim(state: number) {
    await $updateClaimMutation.mutateAsync({ ...claim, state: state });
  }

  async function confirmPayment() {
    isWorking = true;
    try {
      if (!plan.fee) throw Error('Plan must have a min fee');
      if (!payer) throw Error('There is no account to paying the fee');
      if (!isConnected) throw Error('Need a wallet to pay');

      if (isNew) {
        await saveNewClaim();
      } else {
        await updateClaim(UNPAID);
      }

      console.log('saving draft as unpaid', claim);
      const t0 = Date.now();
      const serializedTxn = await createDepositFeeTransaction(
        claim.uid,
        payer,
        plan.fee!,
        plan.fee!
      );
      console.log('serializedTxn: ', serializedTxn);
      const dt = Number((Date.now() - t0) / 1000);

      let response = await (window as any).mina?.sendTransaction({
        transaction: serializedTxn, // serializedTxn,
        feePayer: {
          fee: TXNFEE,
          memo: `Pay claim ${claim.uid}`.substring(0, 32)
        }
      });

      let txnHash = response.hash;
      // transaction done update claim state
      await updateClaim(CLAIMED);
      dispatch('done', { hash: txnHash, success: true });
    } catch (err) {
      isError = true;
      errorMessage = `${err}`;
    }
    isWorking = false;
  }
</script>

<div>
  <div class="mt-20 text-center text-base">
    {#if !isConnected}
      <div class="mt-7 text-sm text-gray-900">
        You need to install or open
        <a href="https://www.aurowallet.com/" class="underline">Auro Wallet</a>
        to continue.
      </div>
    {/if}

    {#if isConnected && !isWorking}
      <div class="border-2 p-3 text-start">
        <h6 class="text-2xl font-semibold text-black">Payment details</h6>
        <p class="text-sm text-gray-500">Your receipt</p>
        <div class="mt-4 flex items-start justify-between text-base">
          <div class="w-1/2">&nbsp;</div>
          <div class="w-1/4 text-start">
            <p class="text-sm font-bold text-gray-800">Fee</p>
            
            <p class={
              (payedByCommunity ? "line-through" : "")
              + " text-gray-700"
              }>{plan.fee} MINA</p>
          </div>
          <div class="w-1/4 text-start">
            <p class="text-sm font-bold text-gray-800">Expire</p>
            <p class="text-gray-700">
              <Time format="MMM DD, YYYY" timestamp={plan.endsUTC} />
            </p>
          </div>
        </div>
      </div>
    {/if}

    {#if isConnected && isWorking}
      <div class="">
        <Spinner />
      </div>
      <div class="mt-7 text-sm text-gray-900">
        Check your Auro Wallet for transaction confirmation...
      </div>
    {/if}

    {#if isError}
      <div class="">SOMETHING HAPPENED !</div>
      <div class="mt-7 text-sm text-gray-900">
        {errorMessage}
      </div>
    {/if}
  </div>

  <div class="--border-t-2 absolute bottom-0 left-0 right-0 px-8 py-6 text-right text-end">
    <Button color="light" class="py-3" on:click={() => dispatch('cancel')}>I'll do it later</Button>
    &nbsp;
    <Button
      color="blue"
      class="py-3"
      disabled={!isConnected || isWorking}
      on:click={() => confirmPayment()}
    >
      Confirm
    </Button>
  </div>
</div>
