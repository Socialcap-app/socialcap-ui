/**
 * A Group to be used in Semaphores. 
 * 
 * The group will contain a set of anonymous identities register with it
 * in an IndexedMerkleMap
 * 
 * The group name name will usually follow the pattern: 'category.{}.group', 
 * for example 'communities.0ac2379.electors' or 'claims.406980.nullifiers'.
 * But in fact can use any name convention, for example '{}.items'.
*/
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Response, postProtocol } from "./requests.js";

export { Group, registerGroup };


class Group {
  pattern = "";
  uid = "";
  guid = "";
  
  static create(pattern: string, uid: string) {
    if (!pattern || !uid) 
      throw Error("A Group requires a pattern and Uuid");
    if (!pattern.includes('{}')) 
      throw Error(`Pattern '${pattern}' must include the '{}' placeholder`)
    return new Group(pattern, uid);
    return 
  }

  constructor(pattern: string, uid: string) {
    const suid = uid.replaceAll('-','');
    this.pattern = pattern;
    this.uid = uid;
    this.guid = pattern.replace('{}', suid); 
  }
}


/**
 * Registers a new group named using the group pattern and uid.
 * If the group exists it return an error.
 * @param guid - the group uid, to replace in pattern
 * @returns a Response
 */
async function registerGroup(
  guid: string
): Promise<Response> {
  const rsp = await postProtocol('registerGroup', {
    guid: guid
  })
 
  return {
    success:  rsp.success,
    data: rsp.success ? rsp.data : null,
    error: !rsp.success ? rsp.error : null
  };
}


/** TODO: **/
/*
removeGroup
*/