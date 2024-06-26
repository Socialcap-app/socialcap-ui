import type { Mina } from "o1js";

import { getCurrentBlockchain } from "$lib/store";
import { type Credential } from "$lib/types";
import { makeString } from "zkcloudworker";

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
    auth: import.meta.env.VITE_ZKCW_AUTH,
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
  const response = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(apiData),
    headers: {
      "Accept": "application/json; charset=utf-8",
      "Content-Type": "application/json; charset=utf-8",
    }
  });
  return await response.json();
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getFileImage(credential: Credential) {
  if (!credential.image) throw new Error('No image provided');
  const response = await fetch(credential.image);
  const fileName = makeString(5) + credential.claimUid;

  // Check if the response is OK
  if (!response.ok) {
    throw new Error(`Failed to fetch image from ${credential.image}: ${response.statusText}`);
  }

  // Step 2: Convert the response to a Blob
  const blob = await response.blob();

  // Step 3: Create a File object from the Blob
  return new File([blob], fileName, { type: blob.type });
}
