/**
 * A Identity to be used in Semaphores.
 * 
 * The commited identity hash is calculated using the user publicKey,
 * and a special 6 digits personal pin.
 * 
 * A given user will have only one commited and registered identity, 
 * but the same identity can be present in more than one Group.
 */
import { PrivateKey, Poseidon, Field, Signature } from "o1js";
import { readPrivateFile, savePrivateFile, setPrivateFolder } from "./private.js";
import { type Response, postProtocol } from "./requests.js";
import { proveIdentityOwnership } from "./prover.js";

export { Identity, registerIdentity } ;


class Identity {
  label = ''; // a user defined label name for this identity
  commitment = ''; // the identity commitment, used to identify this identity
  sk = ''; //  a random newly created secret key, 
  pk = ''; // a newly created public key 
  pin = ''; // a pin nullifier, a user created 6 digits number, initialy 0
  skHash = ''; // the secret key hash, used to verify the secret key when input by user
  pinHash = ''; // the pin hash, used to verify the pin key when input by user
  encryptionKey = ''; // encryption key returned by service when registered
  ownershipProof = ''; // proof that he owns this identity
  // DEPRECATED trapdoor from Semaphore v4, a newly created random 6 digits number 

  /** 
   * Create a new identity for this user.
   * NOTE: It will also create a random private key and derived public key for 
   * this identity. BUT this key pair is NOT associated to his wallet or any 
   * MINA account. It will be used only for signing signals and verifying 
   * signatures, so it will not be possible to trace its use to any account 
   * thus preserving anonymity.
   * @param label a name or label for this identity, assigned by user
   * @param pin a six digits pin number, assigned by the user
  */ 
  static create(label: string, pin: string) {
    return new Identity(_cleanStr(label), pin.padStart(6, '0'));
  }

  /**
   * Set the private folder path (default is ~/.private)
   * @param path 
   */
  static privateFolder(path: string) {
    setPrivateFolder(path);
  }

  /**
   * Reads a private JSON identity file from the '~/.private' folder
   * @param name 
   * @returns the data obj
   */
  static read(name: string) {
    const obj = readPrivateFile(name);
    return Object.assign(new Identity(obj.label, obj.pin), obj);
  }
  
  constructor(label: string, pin: string) {
    this.label = label;
    this.pin = pin.padStart(6, '0');

    // new random private,public key pair
    const rsk = PrivateKey.random();
    const rpk = rsk.toPublicKey();
    this.pk = rpk.toBase58();
    this.sk = rsk.toBase58();
    
    // finally calculate commitment
    this.commitment = Poseidon.hash(
      rpk.toFields() // the identity publicKey
      .concat([Field(this.pin)]) // the user Pin number
    ).toString();

    // calculate helper validate hashes
    this.skHash = Poseidon.hash(rsk.toFields()).toString();
    this.pinHash = Poseidon.hash([Field(this.pin)]).toString();
  }

  public save() {
    savePrivateFile(this.label, this);
  }
}


/**
* Registers this identity in some Semaphore group.
* 
* Note that there will be one different Merkle for each group, 
* and the same identity can be registered in many groups.
* 
* @param identity the identity commitment to register
* @returns an encryptionKey only shared by this identity and the service
*/
async function registerIdentity(
  identity: Identity,
  pin: string
 ): Promise<Response> {

  // we need to get the signature 
  // we can sign directly using the privateKey in the identity 
  const ts = Date.now().toString();
  const signature = Signature.create(
    PrivateKey.fromBase58(identity.sk), 
    [Field(identity.commitment), Field(ts)]
  );
  console.log('signature: ', signature);

  const proof = {};//await proveIdentityOwnership(identity, pin, signature);
  identity.ownershipProof = JSON.stringify(proof);
  identity.save();

  const rsp = await postProtocol('registerIdentity', {
    commitment: identity.commitment,
    pk: identity.pk,
    proofOfIdentity: JSON.stringify(proof),
    signature: JSON.stringify(signature),
    ts: ts
  })
 
  return {
    success:  rsp.success,
    data: rsp.success ? rsp.data : null,
    error: !rsp.success ? rsp.error : null
  };
}


// Helpers 

/** Removes all non-ASCII characters and spaces, for use as a filename */
const _cleanStr = (input: string): string => {
  // Remove all non-ASCII characters
  // eslint-disable-next-line no-control-regex
  let cleaned = input.replace(/[^\x00-\x7F]/g, '');
  // Replace spaces with underscores or remove them
  cleaned = cleaned.replace(/\s+/g, '_');
  // Optionally, remove any remaining characters that are not suitable for filenames
  // eslint-disable-next-line no-useless-escape
  cleaned = cleaned.replace(/[^a-zA-Z0-9_\-\.]/g, '');
  return cleaned;
};