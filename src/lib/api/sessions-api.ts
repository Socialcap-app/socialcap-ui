import { API, type APIResponse } from "./api-client";

export { 
  requestOTP,
  login,
  signUp,
  guestLogin
}

async function requestOTP(params: {
  email: string 
}): Promise<APIResponse> {
  const rs: APIResponse = await API.mutate("request_otp", params);
  return rs;
}

async function login(params: {
 session_key: string, 
  otp: string
}): Promise<APIResponse> {
  const rs: APIResponse = await API.mutate("login", params);
  return rs;
}

async function signUp(params: {
  email: string,
  full_name: string
}): Promise<APIResponse> {
  const rs: APIResponse = await API.mutate("sign_up", params);
  return rs;
}

async function guestLogin(): Promise<APIResponse> {
  const rs: APIResponse = await API.mutate("guest", {});
  return rs;
}
