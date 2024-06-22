<script lang="ts">
  import { createEventDispatcher, onMount, tick } from "svelte";
  import { Button, Badge, Spinner } from "flowbite-svelte";
  import Time from "svelte-time/Time.svelte";
  import { type Claim } from "$lib/types/claim";
	import { type Plan } from "$lib/types";

  const dispatch = createEventDispatcher();

   let isConnecting = false, isError = false, isConnected = false;
  let accountId = "";
  let errorMessage = "";

  onMount(async () => {
    isConnected = await isWalletConnected();
  })

  function isWalletAvailable() {
    return (typeof (window as any).mina !== 'undefined');
  }

  async function isWalletConnected() {
    if (isWalletAvailable()) {
      const accounts: any[] = await (window as any).mina?.getAccounts() || [];
      if (accounts.length) {
        accountId = accounts[0];
        return true;
      }
    }
    return false;
  }

  async function connectWallet() {
    isConnecting = true;
    try {
      const accounts: any[] = await (window as any).mina?.requestAccounts() || [];
      accountId = accounts[0];
      isConnecting = false;
      isConnected = true;
      await tick();
    }
    catch (err) {
      isError = true;
      isConnecting = false;
      isConnected = false;
      errorMessage = `${err}`;
    }
  }
</script>

<div>
  <div class="text-base mt-20 text-center">
    {#if !isConnected && !isConnecting}
      <img class="inline-block" src="/images/auro-wallet.svg" />
      <div class="text-sm mt-7 text-gray-900">
        You need to install or open 
        <a href="https://www.aurowallet.com/" class="underline">Auro Wallet</a>
        to continue.
      </div>
    {/if}

    {#if isConnected}
      <img  class="inline-block h-10" src="/icons/Activity.svg"/>
      <div class="mt-5 text-gray-900">
        Connected with account <Badge large rounded color="green" class="py-1">
          {accountId.slice(0,6)}...{accountId.slice(-6)}
        </Badge>
      </div>
    {/if}

    {#if isConnecting}
      <div class="">
        <Spinner />
      </div>  
      <div class="text-sm mt-7 text-gray-900">
        Check your Auro Wallet for confirmation...
      </div>
    {/if}
  </div>

  <div class="text-end --border-t-2 px-8 py-6 absolute bottom-0 left-0 right-0 text-right">
    <Button color="light"  class="py-3" 
      on:click={() => dispatch("cancel")}>
      I'll do it later
    </Button>
    &nbsp;
    {#if !isConnected}
      <Button color="blue" class="py-3" 
        on:click={() => connectWallet()}>
        Connect
      </Button>
    {/if}  
    {#if isConnected}
      <Button color="blue" class="py-3" 
        on:click={() => dispatch("continue")}>
        Continue
      </Button>
    {/if}
  </div>
</div>
