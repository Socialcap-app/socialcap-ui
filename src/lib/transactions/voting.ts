/*
**
 * Builds the Nullifier from the set of received Leafs
 * We need to do this here because we can not inlcuide Snarkyjs in the 
 * api/queries module or the build fails.
 *
import { MerkleMap, Field, PublicKey } from "o1js";
import { UID, PlanElectorsNullifierProxy } from "@socialcap/batch-voting";
import { getNullifier } from "@apis/queries";

// $$$$TODO$$$$$ Fix Nullifier before using it 

export async function buildNullifier(params: any) {

  const data = await getNullifier(params);
  if (!data)
    return null;

  const claimUid = params.claimUid;
  const senderAccountId =  params.senderAccountId;
  const electorKey = PlanElectorsNullifierProxy.key(
    PublicKey.fromBase58(senderAccountId),
    UID.toField(claimUid)
  )

  const leafs = data?.leafs || [];
  const map = new MerkleMap();
  for (let j=0; j < leafs.length; j++) {
    const key = Field(leafs[j].key);
    const hashed = Field(leafs[j].hash);
    map.set(key, hashed);
    //console.log(`Nullifier leaf ${key.toString()} ${hashed.toString()}`)
  }

  const nullifier: PlanElectorsNullifierProxy = {
    root: map.getRoot(),
    witness: map.getWitness(electorKey)
  }

  return nullifier;
}
*/
export async function submitVote(task: any, vote: string) {
  /*  
    try {
      const mina = window!.mina;
      if (mina === null) return {
        success: false,
        error: "MINA wallet not available !"
      }
      let sender  = get(auroWallet$).sender;
  
      // the VotingContract instance linked to this claim 
      let claim = task.claim;
      const publicKey = PublicKey.fromBase58(claim.accountId);
      const zkApp = new VotingContract(publicKey);
  
      // wait for account to be available
      const result = await fetchAccount({ publicKey: publicKey });
      console.log(`Account exists ? `, (result?.account !== undefined));
      console.log("zkappInstancePublicKey(s) assertEqual ? ",
        (claim.accountId === result?.account?.publicKey?.toBase58())
      );
   
      // assert we have the right claim and instance
      let cuid = zkApp.claimUid.get().toString();
      if (cuid !== UID.toField(claim.uid).toString())
        throw "Asserting cliam and instance failede ! Not the same claim !"; 
      //console.log(publicKey.toBase58(), cuid, claim.uid, claim.accountId);
  
      // transform the Vote
      const val: Field = vote === "Y" ? Field(1) : (vote === "N" ? Field(-1) : Field(0));
  
      // the Nullifier used for avoid double votes
      let nullifier = await buildNullifier({
        claimUid: claim.uid,
        senderAccountId: sender.toBase58()
      }) as NullifierProxy;
  
      // now we send the vote
      const txn = await Mina.transaction(
        { sender: sender, fee: CLAIM_TX_FEE },
        () => {
          zkApp.confirmTaskDone(val, nullifier)
      });
      await txn.prove();
  
      // loged user will pay with Wallet
      const pendingTxn = await mina.sendTransaction({
        transaction: txn.toJSON(),
        feePayer: {
          fee: CLAIM_TX_FEE,
          memo: `Confirm vote`,
        },
      });
  
      console.log(
        `Transaction at https://berkeley.minaexplorer.com/transaction/${pendingTxn?.hash}`
        +`\n... waiting for transaction to be included...`
      );
  
      // if you want to inspect the transaction, you can print it out:
      console.log(txn.toPretty());
  
      // we need to report the task as completed and update the Nullifier
      // when the transaction is finally included
      await submitTask({
        uid: task.uid,
        claimUid: claim.uid,
        senderAccountId: sender.toBase58(),
        state: DONE,
        txn: pendingTxn
      });
      
      return {
        success: true,
        pendingTxn: pendingTxn
      }
    } catch (err: any) {
      // You may want to show the error message in your UI to the user if the transaction fails.
      console.log("submitVote Error=", err.message);
      return {
        success: false,
        error: err.message.substr(0, 40)
      }
    }
  */
}
  