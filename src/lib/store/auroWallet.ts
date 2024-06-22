import { PublicKey } from "o1js";

// Svelte stores
import { writable, get } from "svelte/store";

export const berkeleyNetwork$ = writable();
export const deployedSocialcap$ = writable();
export const deployedVoting$ = writable();
export const deployedBatchVoting$ = writable();
export const auroWallet$ = writable({
  connected: false,
  accountExists: false,
  publicKey:"",
  sender: PublicKey.empty(),
  api: (window as any).mina
});

export const MINABerkeley = "https://proxy.berkeley.minaexplorer.com/graphql";

export const MINAExplorer = "https://berkeley.minaexplorer.com";

