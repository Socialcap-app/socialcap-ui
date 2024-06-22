import type { Mina } from "o1js";
import axios from "axios"
import { getCurrentBlockchain } from "$lib/store";
import { type Credential } from "$lib/types";

export function serializeTransaction(
  tx: Mina.Transaction<false, false>
): string {
  const length = tx.transaction.accountUpdates.length;
  let i;
  let blindingValues = [];
  for (i = 0; i < length; i++) {
    const la = tx.transaction.accountUpdates[i].lazyAuthorization;
    if (
      la !== undefined &&
      (la as any).blindingValue !== undefined &&
      la.kind === "lazy-proof"
    )
      blindingValues.push(la.blindingValue.toJSON());
    else blindingValues.push("");
  }
  const serializedTransaction = JSON.stringify(
    {
      tx: tx.toJSON(),
      blindingValues,
      length,
      fee: tx.transaction.feePayer.body.fee.toJSON(),
      sender: tx.transaction.feePayer.body.publicKey.toBase58(),
      nonce: tx.transaction.feePayer.body.nonce.toBigint().toString(),
    },
    null,
    2
  );
  return serializedTransaction;
}

export async function zkCloudWorkerRequest(params: any) {
  const { command, task, transactions, args, metadata, mode, jobId } = params;
  const chain = getCurrentBlockchain().chainId;
  const apiData = {
    auth: import.meta.env.VITE_ZKCW_AUTH  ,
    command: command,
    jwtToken: import.meta.env.VITE_ZKCW_JWT,
    data: {
      task,
      transactions: transactions ?? [],
      args,
      repo: "mint-worker",
      developer: "DFST",
      metadata,
      mode: mode ?? "sync",
      jobId,
    },
    chain: `devnet`,
  };
  const endpoint = import.meta.env.VITE_ZKCW_ENDPOINT + chain;

  const response = await axios.post(endpoint, apiData);
  return response.data;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getFileImage(credential: Credential) {
  if (!credential.image) throw new Error('No image provided');
  const response = await fetch(credential.image);
  const fileName = credential.claimId;

  // Check if the response is OK
  if (!response.ok) {
    throw new Error(`Failed to fetch image from ${credential.image}: ${response.statusText}`);
  }

  // Step 2: Convert the response to a Blob
  const blob = await response.blob();

  // Step 3: Create a File object from the Blob
  return new File([blob], fileName, { type: blob.type });
}
