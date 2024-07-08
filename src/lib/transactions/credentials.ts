import { zkCloudWorkerClient } from "zkcloudworker";
import { getCurrentBlockchain } from "$lib/store";

const MINA = 1e9;
export const TXNFEE = 150_000_000;


export async function createCredentialOwnershipCheckTransaction(
  credentialUid: string,
  sender: string,
  chainId?: string,
) {
  const JWT = import.meta.env.VITE_ZKCW_JWT; 

  console.log("zkCloudWorkerClient JWT:", JWT);
  const api = new zkCloudWorkerClient({ jwt: JWT });

  const response = await api.execute({
    mode: "async",
    repo: "socialcap-crendential-functions-worker",
    developer: "LEOMANZA",
    task: "check-credential-owner",
    metadata: `Check owner for Credential ${credentialUid}`,
    args: JSON.stringify({ 
      chainId: chainId || getCurrentBlockchain().chainId
    }),
    transactions: [JSON.stringify({
      memo: `Check owner for Credential ${credentialUid}`.substring(0, 32), // memo field in Txn
      sender: sender,
      credential_id: credentialUid
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
