import { connect, JSONCodec } from "nats.ws";
import { NATS_SERVER_WSS } from "./connections";

const codec = JSONCodec();

/**
 * Notifies a message using NATS.io. 
 * Depending on the given 'scope' it will publish the message to one of 
 * the following subjects:
 *  'socialcap:all' for messages destined to everyone
 *  'socialcap:group.communityUid' for messages destined to a given community 
 *  'socialcap:personal.userUid' for messages destined to a given user * 
 * @param scope - who will receive it: 'all', 'group' or 'personal'
 * @param msg - the message content object
 * @param msg.memo - the message text we want to send 
 * @param masg.subject? - the given group or user to whcih we send it
 * @param msg.type? - message type: 'message', 'request', 'transaction'
 * @param msg.metadata? - metadata associated to the message, request or transaction
 * @param msg.state? - state associated to the message, request or transaction
 */
export async function notify(
  scope: string, 
  msg: {
    memo: string,
    subject?: string,
    type?: string,
    metadata?: string,
    state?: number
  }
) {
  try {
    if (!scope) throw "Missing 'scope' param";
    if (!msg) throw "Missing 'msg' param";
    if (!msg.memo) throw "Missing 'msg.memo' param";
    
    const nc = await connect({ 
      servers: NATS_SERVER_WSS 
    });

    // the NATS subject where we will publish it
    const natsSubject = `socialcap:notifications`;
  
    await nc.publish(
      natsSubject, 
      codec.encode({
        "scope": scope,
        "memo": msg.memo,
        "subject": msg.subject || 'all',
        "type": msg.type || 'message',
        "state": msg.state || 0,
        "metadata": msg.metadata || '{}',
        "createdUTC": (new Date()).toISOString(),
      })
    )
  }
  catch(error) {
    console.log(`notify(${scope}, msg: ${JSON.stringify(msg)}) ERROR: `, error);
  }
}
