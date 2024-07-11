import { calculateSHA512 } from "../sha512";
import { pinFile } from "../ipfs";

import type { ProofOfNFT, SimpleMintNFT, SimpleImageData } from "$lib/types/mintNft";
import { getCurrentBlockchain } from "$lib/store";
import { sleep } from "zkcloudworker";
import { zkCloudWorkerRequest } from "./tools";
import { getMinaNftUrl, getMinascnanUrl } from "$lib/store/api";
const MINANFT_URL = getMinaNftUrl();
const MINASCAN_URL = getMinascnanUrl();
export async function prepareTransaction(params: SimpleMintNFT): Promise<{
  isPrepared: boolean;
  transaction?: string;
  fee?: number;
  memo?: string;
  serializedTransaction?: string;
  mintParams?: string;
}> {
  const { contractAddress } = params;
  console.log("sendSimpleMintCommand", params);

  let args = JSON.stringify({
    contractAddress,
  });

  const transaction = JSON.stringify(params, null, 2);

  let answer = await zkCloudWorkerRequest({
    command: "execute",
    transactions: [transaction],
    task: "prepare",
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
    return { isPrepared: false };
  } else if (result === undefined) {
    return { isPrepared: false };
  } else return { isPrepared: true, ...JSON.parse(result) };
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

export async function getAccount(): Promise<string | undefined> {
  const accounts = await (window as any)?.mina?.requestAccounts();
  console.log("Accounts", accounts);
  let address: string | undefined = undefined;
  if (accounts?.code === undefined && accounts?.length > 0) {
    address = accounts[0];
    console.log("Address", address);
  }
  return address;
}

export async function simpleMintNFT(params: {
  name: string;
  image: File;
  collection: string;
  description: string;
  price: number;
  keys: ProofOfNFT[];
  developer: string;
  repo: string;
}) {
  const { name, image, price, collection, description, keys, developer, repo } =
    params;

  const owner = await getAccount();
  if (owner === undefined) {
    console.error("Owner address is undefined");
    return;
  }

  if (name === undefined || name === "") {
    console.error("NFT name is undefined");
    return;
  }

  if (image === undefined) {
    console.error("Image is undefined");
    return;
  }

  const contractAddress = import.meta.env.VITE_MINANFT_CONTRACT;
  if (contractAddress === undefined) {
    console.error("Contract address is undefined");
    return;
  }

  const chain = getCurrentBlockchain().chainId;

  const ipfsPromise = pinFile({
    file: image,
    keyvalues: {
      name,
      owner,
      contractAddress,
      chain,
      developer,
      repo,
    },
  });

  const sha3_512 = await calculateSHA512(image);
  console.log("image sha3_512", sha3_512);

  const ipfs = await ipfsPromise;
  console.log("image ipfs", ipfs);

  const imageData: SimpleImageData = {
    filename: image.name.substring(0, 30),
    size: image.size,
    mimeType: image.type.substring(0, 30),
    sha3_512,
    storage: `i:${ipfs}`,
  } as SimpleImageData;

  const nftData: SimpleMintNFT = {
    contractAddress,
    chain,
    name,
    description,
    collection,
    price,
    owner,
    image: imageData,
    keys,
  } as SimpleMintNFT;

  const {
    isPrepared,
    transaction,
    fee,
    memo,
    serializedTransaction,
    mintParams,
  } = await prepareTransaction(nftData);
  if (
    !isPrepared ||
    transaction === undefined ||
    fee === undefined ||
    memo === undefined ||
    serializedTransaction === undefined ||
    mintParams === undefined
  ) {
    console.error("Failed to prepare transaction");
    return;
  }

  const payload = {
    transaction,
    onlySign: true,
    feePayer: {
      fee: fee,
      memo: memo,
    },
  };
  console.timeEnd("prepared tx");
  console.timeEnd("ready to sign");
  const txResult = await (window as any).mina?.sendTransaction(payload);
  console.log("Transaction result", txResult);
  console.time("sent transaction");
  const signedData = txResult?.signedData;
  if (signedData === undefined) {
    console.log("No signed data");
    return undefined;
  }

  const sentTx = await sendTransaction({
    serializedTransaction,
    signedData,
    mintParams,
    contractAddress,
  });
  console.timeEnd("sent transaction");
  console.log("Sent transaction", sentTx);
  return { tx: sentTx, mintUrl: `${MINANFT_URL}/@${name}`, explorerUrl: `${MINASCAN_URL}` };
}