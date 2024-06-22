/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect, JSONCodec, type NatsConnection } from "nats.ws";
import { NATS_SERVER_WSS } from "./connections";

// Create a JSON codec for encoding and decoding messages
const codec = JSONCodec();

// Listen to this subject and handle its message
function listenSubject(
  connection: NatsConnection, 
  subject: string, 
  handleMessage: (data: any) => void
) {
  // Subscribe to the subject
  const subscription = connection.subscribe(subject);
  console.log(`Subscribed to subject ${subject}`);

  // Process messages received on the subscribed subject
  (async () => {
    for await (const msg of subscription) {
      try {
        const data = codec.decode(msg.data);
        console.log(`Received message on subject ${subject}:`, data);

        // Perform processing logic here
        handleMessage(data);
      }
      catch (err) {
        console.error('Error decoding message: ', err);
      }
    }
  })();
}

export async function listenAll(
  handlers: {
    subject:string,
    handler: (data: any) => void 
  }[]
) {
  try {
    if (!handlers || !handlers.length)   
      throw Error(`No handlers for NATSClient.`)

    // connect to the NATS server
    const nc = await connect({
      servers: NATS_SERVER_WSS,
    });
    console.log(`NATSClient connected`);

    // listen to the list of subjects
    for (let j=0; j < handlers.length; j++) {
      listenSubject(nc, handlers[j].subject, handlers[j].handler);
    }
  } catch (error) {
    console.error('NATSClient ERROR: ', error);
  }
}
