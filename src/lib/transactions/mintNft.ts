import { getCurrentBlockchain } from "$lib/store";
import axios from "axios";
import type { MintParams } from "minanft";
import type { PublicKey } from "o1js";
import { zkCloudWorkerClient } from "zkcloudworker";

export async function signMintTransaction(params: {
  claimUid: string
  sender: PublicKey,
  mintParams: MintParams,
  fee: number,
  memo: string
}) {
  const { claimUid, sender, mintParams, fee, memo } = params;
  console.log("signMintTransaction", {
    claimUid, 
    sender,
    mintParams,
    fee,
    memo
  });

  const JWT = import.meta.env.VITE_ZKCW_JWT; 

  console.log("zkCloudWorkerClient JWT:", JWT);
  const api = new zkCloudWorkerClient({ jwt: JWT });

  const response = await api.execute({
    mode: "async",
    repo: "socialcap-minanft-worker",
    developer: "LEOMANZA", 
    task: "mint-minanft",
    metadata: `Sign and pay fee for mint  ${claimUid}`,
    args: JSON.stringify({ 
      chainId: getCurrentBlockchain().chainId
    }),
    transactions: [JSON.stringify({
      memo: `Sign and pay fee for mint  ${claimUid}`.substring(0, 32), // memo field in Txn
      payer: sender,
      fee,
      mintParams
    })],
  });

  console.log("API response:", response);
  const jobId = response?.jobId;
  if (jobId === undefined) {
    throw new Error("Job ID is undefined");
  }

  console.log("Waiting for job ...");
  const jobResult = await api.waitForJobResult({ jobId });
  const { result } = jobResult.result;
  const serializedTxn = result; 
  return serializedTxn;
  
}

export async function sendTransaction(params: {
  serializedTransaction: string;
  signedData: string;
  mintParams: string;
  contractAddress: string;
}): Promise<{ isSent: boolean; hash: string }> {
  const { serializedTransaction, signedData, contractAddress, mintParams } =
    params;
  console.log("sendTransaction", {
    serializedTransaction,
    signedData,
    contractAddress,
    mintParams,
  });

  let args = JSON.stringify({
    contractAddress,
  });

  const transaction = JSON.stringify(
    {
      serializedTransaction,
      signedData,
      mintParams,
    },
    null,
    2
  );

  let answer = await zkCloudWorkerRequest({
    command: "execute",
    transactions: [transaction],
    task: "mint",
    args,
    metadata: `mint`,
    mode: "async",
  });

  console.log(`zkCloudWorker answer:`, answer);
  const jobId = answer.jobId;
  console.log(`jobId:`, jobId);
  let result;
  while (result === undefined && answer.jobStatus !== "failed") {
    await sleep(5000);
    answer = await zkCloudWorkerRequest({
      command: "jobResult",
      jobId,
    });
    console.log(`jobResult api call result:`, answer);
    result = answer.result;
    if (result !== undefined) console.log(`jobResult result:`, result);
  }
  if (answer.jobStatus === "failed") {
    return { isSent: false, hash: result };
  } else if (result === undefined) {
    return { isSent: false, hash: "job error" };
  } else return { isSent: true, hash: result };
}

async function zkCloudWorkerRequest(params: any) {
  const chain = getCurrentBlockchain().chainId;
  const { command, task, transactions, args, metadata, mode, jobId } = params;
  const apiData = {
    auth: import.meta.env.VITE_ZKCW_AUTH,
    command: command,
    jwtToken: import.meta.env.VITE_ZKCW_JWT,
    data: {
      task,
      transactions: transactions ?? [],
      args,
      repo: "mint-worker",
      developer: "LEOMANZA",
      metadata,
      mode: mode ?? "sync",
      jobId,
    },
    chain,
  };
  const endpoint = import.meta.env.VITE_ZKCW_ENDPOINT + chain;

  const response = await axios.post(endpoint, apiData);
  return response.data;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}