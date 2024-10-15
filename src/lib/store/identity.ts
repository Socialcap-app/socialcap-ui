/**
 * Identity stored in localStorage.
 */
import type { Identity } from "@socialcap/protocol-sdk";

export { 
  getIdentity, 
  saveIdentity, 
  removeIdentity
} ;

const STORE_KEY = "identity";
let identity: Identity | null = null; // cached

function getIdentity(): Identity | null {
  if (identity) return identity;
  const data = localStorage.getItem(STORE_KEY);
  identity = data && JSON.parse(data) || null; 
  return identity;
};

function saveIdentity(_identity: Identity) {
  if (!_identity)
    throw Error("identity/setIdentity: Invalid identity data");
  localStorage.setItem(STORE_KEY, JSON.stringify(identity));
  identity = _identity;
  return identity;
};

function removeIdentity() {
  localStorage.removeItem(STORE_KEY);
  identity = null;
};
