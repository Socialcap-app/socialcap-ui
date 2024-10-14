<script lang="ts">
  import MyVotes from "./MyVotes.svelte";
  import { MetaTag } from "$lib/components";
  import { Identity, registerIdentity,
    //postRequest, type Response, 
  } from "$lib/semaphore";

	const path: string = '/home';
  const description: string = 'Votes on your community claims';
  const title: string = 'My Votes';
  const subtitle: string = 'My Votes';

  // initSdk({
  //   // CHAIN
  //   CHAIN_ID: "devnet",
  //   // NATS
  //   NATS_SERVER: "nats.socialcap.dev:4222",
  //   NATS_SERVER_WSS: "wss://nats.socialcap.dev:4233",
  //   NATS_APP_USER: "apppass",
  //   NATS_DEBUG: "true",
  // })

//   
//   async function _postRequest(
//     command: string, 
//     params: object
//   ): Promise<Response> {
//     let nats = await import("nats.ws");
// 
//     // setup codec
//     const codec = nats.JSONCodec();
// 
//     // the NATS subject where we will publish it
//     const natsSubject = `socialcap:protocol`;
// 
//     // connect to the NATS server and send a 'ready' request
//     const nc = await nats.connect({ 
//       servers: NATS.SERVER,
//       user: '*',
//       timeout: NATS.TIMEOUT, 
//       debug: NATS.DEBUG 
//     });
//     console.log(`postRequest connected server=${NATS.SERVER} user=*`);
//     console.log(`postRequest ${command} params=${JSON.stringify(params)}`);
// 
//     try {
//       const msg: any = await nc.request(
//         natsSubject, 
//         codec.encode({
//           "post": command,
//           "params": JSON.stringify(params)
//         }),
//         { timeout: 2*60*1000 }
//       )
//       
//       const response: any = codec.decode(msg.data);
//       console.log(`postRequest response=${JSON.stringify(response)}`);
//       if (!response.success) 
//         throw Error(response.error);
// 
//       return { success: true, data: response.data, error: null }
//     }
//     catch (error: any) {
//       console.log(`postRequest failed`);
//       console.log(error);
//       return { success: false, data: null, error: error.message }
//     }
//     finally {
//       // disconect and clean all pendings
//       console.log("postRequest cleanup (drained)");
//       await nc.drain();
//     }
//   }
// 
//   async function _registerIdentity(
//     identity: Identity,
//     pin: string
//   ): Promise<Response> {
// 
//     // we need to get the signature 
//     // we can sign directly using the privateKey in the identity 
//     let ts = Date.now().toString();
//     let signature = Signature.create(
//       PrivateKey.fromBase58(identity.sk), 
//       [Field(identity.commitment), Field(ts)]
//     );
//     console.log('registerIdentity: signature=', signature);
// 
//     //const proof = await proveIdentityOwnership(identity, pin, signature);
//     //identity.ownershipProof = proof;
//     //identity.save();
// 
//     let rsp = await _postRequest('registerIdentity', {
//       commitment: identity.commitment,
//       pk: identity.pk,
//       proofOfIdentity: JSON.stringify({"proof": "fake"}), // JSON.stringify(proof),
//       signature: JSON.stringify(signature),
//       ts: ts
//     })
//     console.log("registerIdentity: postRequest rsp=", rsp);
// 
//     return {
//       success:  rsp.success,
//       data: rsp.success ? rsp.data : null,
//       error: !rsp.success ? rsp.error : null
//     };
//   }

  let pin = '010101'
  let identity = Identity.create("testidn", pin);
  identity.save();
  let rsp: any = {};

  async function doIt() {
    console.log(identity, pin);
    rsp = await registerIdentity(identity, pin);
  }
</script>

<MetaTag {path} {description} {title} {subtitle} />

<h1>Identity</h1>
<pre>
  identity={ JSON.stringify(identity, null, 2) }
</pre>
<button class="border p-2" 
  on:click={() => doIt()}
  >register it
</button>
<pre>
  Rsp={ JSON.stringify(rsp, null, 2) }
</pre>

<main class="p-4">
  <MyVotes />
</main>
