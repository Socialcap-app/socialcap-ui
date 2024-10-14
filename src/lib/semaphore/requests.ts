/* eslint-disable @typescript-eslint/no-explicit-any */
import { NATS_SERVER_WSS } from "$lib/nats/connections";
import { connect, JSONCodec, } from "nats.ws";

// const NATS_SERVER_WSS = "wss://nats.socialcap.dev:4233";
const NATS_SERVER = NATS_SERVER_WSS;

export {
  type Response,
  postProtocol,
}

interface Response {
  success: boolean;
  data: object | null;
  error: any | null;
}


/**
 * Sends a request to 'socialcap:protocol' and waits for a response.
*/
async function postProtocol(
  command: string, 
  params: object
): Promise<Response> {
  // setup codec
  const codec = JSONCodec();

  // the NATS subject where we will publish it
  // TODO const natsSubject = `socialcap:protocol.${id}`;
  const natsSubject = `socialcap:protocol`;

  // connect to the NATS server and send a 'ready' request
  const nc = await connect({ 
    servers: NATS_SERVER,
    user: '*',
    timeout: 5*60*1000, 
    debug: true 
  });
  console.debug(`semaphore.postRequest connected to ${NATS_SERVER}`);

  try {
    const msg: any = await nc.request(
      natsSubject, 
      codec.encode({
        "post": command,
        "params": JSON.stringify(params)
      }),
      { timeout: 2*60*1000 }
    )
    
    const response: any = codec.decode(msg.data);
    console.debug("semaphore.postRequest postRequest response: ", response);
    if (!response.success) 
      throw Error(response.error);

    return { success: true, data: response.data, error: null }
  }
  catch (error: any) {
    console.debug(`semaphore.postRequest ${command} error: `, error);
    return { success: false, data: null, error: error.message }
  }
  finally {
    // disconect and clean all pendings
    console.debug("semaphore.postRequest cleanup (drained)");
    await nc.drain();
  }
}
