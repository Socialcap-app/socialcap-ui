/**
 * Manages the currently active session, stored in localStorage.
 * When signing out we need to clear it using removeActiveSession(). 
 */
import { type Session } from "$lib/types/session";

export { 
  getCurrentSession, 
  getDefaultSession,
  setActiveSession, 
  removeActiveSession 
} ;

const STORE_KEY = "current-session";

const DEFAULT_SESSION: Session = {
  host: "api.socialcap.api", // "localhost"
  protocol: "https", // localhost uses "http"
  port: 443, // locahost uses 3080
  authorization: "",
};


function getCurrentSession(): Session | null {
  const data = localStorage.getItem(STORE_KEY);
  // we simulate it for now ...
  // data = mockup;
  // return data && JSON.parse(data) || null; 
  return JSON.parse(TMP_SESSION) || data && JSON.parse(data) || null; 
};

function getDefaultSession(): Session {
  return DEFAULT_SESSION; 
};

function setActiveSession(session: Session) {
  if (! session)
    throw Error("session/setActiveSession: Invalid session");
  localStorage.setItem(STORE_KEY, JSON.stringify(session));
  return session;
};

function removeActiveSession() {
  localStorage.removeItem(STORE_KEY);
  return;
};


/* mazito.v2@gmail.com */
const TMP_SESSION = JSON.stringify({
    "host":"api.socialcap.app",
    "port":443,
    "protocol":"https",
    "authorization":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJlYzNjNmUyNTRkMGI0MmRlYmQ5MzlkOWE3YmQ3ZGRkZCIsInNlc3Npb25fa2V5IjoiZWRiMmM5YTU2NGMzNDQxZmIwM2VlZGE4Njc0NGUwNzIiLCJjcmVhdGVkX3V0YyI6IjIwMjQtMDMtMTlUMTI6NDE6MTcuOTQxWiIsImV4cGlyZXNfdXRjIjpudWxsLCJpYXQiOjE3MTA4NTIwNzd9.7lmOewsVBwWPACu4_BU6HM8NfElzRJz19V_SqCgHwzw"
});
